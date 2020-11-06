import { NoiError, NoiErrorOptionsObject } from "./error";
import { NoiAuth } from "./auth";
import { getPointsDistance } from "@noi/utils";
import { getAssetPath } from "@stencil/core";

export const NOI_SERVICE_ERR_UNKNOWN = 'error.noi-service.unknown';
export const NOI_SERVICE_ERR_OFFLINE = 'error.noi-service.offline';
export const NOI_SERVICE_ERR_DATA_FORMAT = 'error.noi-service.data-format';
export const LINK_STATION_ERR_NOT_FOUND = 'error.link-station.not-found';
export const LINK_STATION_PATH_ERR_NOT_FOUND = 'error.link-station-path.not-found';
export const LINK_STATION_VELOCITY_ERR_NOT_FOUND = 'error.link-station-velocity.not-found';


export function getErrByServiceError(_: Error): NoiError {
  return new NoiError(NOI_SERVICE_ERR_OFFLINE);
}

export function getErrByStatus(status: number): NoiError {
  if (status === 500) {
    return new NoiError(NOI_SERVICE_ERR_UNKNOWN);
  }
  return new NoiError(NOI_SERVICE_ERR_UNKNOWN);
}

export interface NoiErrorService {
  show(errCode: string, options?: NoiErrorOptionsObject);
  showError(error: NoiError);
}

export interface NoiLinkStation {
  type: 'LinkStation',
  id: string,
  name: string,
  origin: string,
  start: NoiBTStation,
  end: NoiBTStation,
  geometry: GeoJSON.Geometry,
  distance?: number
}

export interface NoiTreeItem {
  id: string;
  description: string;
  urls: {
    stations: string;
    stationsDataTypes: string;
    stationsDataTypesMeasurements: string;
  }
}

export interface NoiBTStation {
  id: string;
  coordinates: {lat: number; long: number};
  name: string;
  type: 'BluetoothStation'
}

export interface NoiHighwayStation {
  id: string;
  name: string;
  coordinates: {lat: number; long: number};
  highway: 'A22';
  position: number;
};

export type JamLevel = '' | 'light' | 'strong';

function getJamLevel(jams: {[id: string]: [number, number]}, id: string, timeSec: number): JamLevel {
  if (!jams[id] || !Array.isArray(jams[id]) || jams[id].length !== 2) {
    return undefined;
  }
  const j = jams[id];
  if (timeSec < j[0]) {
    return '';
  }
  if (timeSec < j[1]) {
    return 'light';
  }
  return 'strong';
}

export function parseHighwayStations(linkStations: Array<any>): Array<NoiHighwayStation> {
  const stations = linkStations.reduce<{[id: string]: NoiHighwayStation}>((result, s) => {
    if (
      !s ||
      typeof(s.scode) !== 'string' ||
      typeof(s.sname) !== 'string' ||
      !s.smetadata ||
      !s.smetadata.latitudineinizio || !s.smetadata.longitudininizio ||
      !s.smetadata.latitudinefine || !s.smetadata.longitudinefine
    ) {
      return result;
    }
    const ids: string[] = s.scode.split('-');
    if (ids.length !== 2) {
      return result;
    }
    const names: string[] = s.sname.split(' - ');
    if (names.length !== 2) {
      return result;
    }
    const coordinates: {lat: number, long: number}[] = [
      {lat: s.smetadata.latitudineinizio, long: s.smetadata.longitudininizio},
      {lat: s.smetadata.latitudinefine, long: s.smetadata.longitudinefine},
    ];
    const positions = [
      +s.smetadata.metroinizio,
      +s.smetadata.metrofine,
    ]
    if (!result[ids[0]]) {
      result[ids[0]] = {
        id: ids[0],
        name: names[0],
        coordinates: coordinates[0],
        highway: 'A22',
        position: positions[0]
      };
    }
    if (!result[ids[1]]) {
      result[ids[1]] = {
        id: ids[1],
        name: names[1],
        coordinates: coordinates[1],
        highway: 'A22',
        position: positions[1]
      };
    }
    return result;
  }, {});
  return Object.keys(stations)
    .map(i => stations[i])
    .filter(i => {
      // filter out the german ring data
      return !i.id.startsWith('1111');
    });
}

export function parse4326Coordinates(value: {x: number, y: number; srid: number}): {lat: number; long: number} {
  if (!value || value.srid !== 4326) {
    return null;
  }
  try {
    const long = +value.x * 180 / 20037508.34;
    const lat = Math.atan(Math.exp(+value.y * Math.PI / 20037508.34)) * 360 / Math.PI - 90;
    return {lat, long};
  } catch (error) {
    return null;
  }
}

export function parseBluetoothStation(prefix, s: any): NoiBTStation {
  if (s[`${prefix}type`] !== 'BluetoothStation') {
    return null;
  }
  if (!s[`${prefix}coordinate`] || !s[`${prefix}coordinate`].y) {
    return null;
  }
  const coordinates = {lat: s[`${prefix}coordinate`].y, long: s[`${prefix}coordinate`].x};
  if (!coordinates) {
    return null;
  }
  return {
    id: s[`${prefix}code`],
    name: s[`${prefix}name`],
    coordinates,
    type: 'BluetoothStation'
  };
}

function calcGeometryDistance(value: any) {
  if (value.type !== 'LineString') {
    return undefined;
  }
  return (value.coordinates as Array<[number, number]>).reduce<{prev: [number, number], distance: number}>((result, i) => {
    if (result.prev !== null) {
      result.distance += getPointsDistance(result.prev, i);
    }
    result.prev = i;
    return result;
  }, {prev: null, distance: 0}).distance;
}

function getLinkStationParser(options?: {calcGeometryDistance?: boolean}) {
  return (s: any) =>{
    const start: NoiBTStation = parseBluetoothStation('sb', s);
    const end: NoiBTStation = parseBluetoothStation('se', s);
    const result: NoiLinkStation = {
      type: 'LinkStation',
      id: s.ecode,
      name: s.ename,
      origin: s.eorigin,
      geometry: s.egeometry,
      start,
      end
    };
    if (options && options.calcGeometryDistance && s.egeometry) {
      result.distance = calcGeometryDistance(s.egeometry);
    }
    return result;
  }
}


export class OpenDataHubNoiService {
  static BASE_URL = 'https://mobility.api.opendatahub.bz.it';
  static VERSION = 'v2';

  public async request(url: string, init: RequestInit = {}) {
    try {
      const response = await fetch(url, init);
      if (!response.ok){
        const noiErr = getErrByStatus(response.status);
        throw noiErr;
      }
      const json = await response.json();
      return json;
    } catch (err) {
      if (err instanceof NoiError) {
        throw err;
      }
      const noiErr = getErrByServiceError(err);
      throw noiErr;
    }
  }

  async fetchJamThresholds(): Promise<{[stationId: string]: [number, number]}> {
    try {
      const result = await fetch(getAssetPath('./jams.json'));
      if (result.ok) {
        return result.json();
      }
      return {};
    } catch (error) {
      console.warn('No jams information');
      return {};
    }
  }

  async getLinkStationsTime(ids: Array<string>, auth = false): Promise<Array<{id: string, timeSec: number, sync: Date, jam?: JamLevel}>> {
    const jams = await this.fetchJamThresholds();
    const where = `scode.in.(${ids.join(',')})`;
    const select = `scode,sdatatypes.tempo`;
    const accessToken = auth ? await NoiAuth.getValidAccessToken() : null;
    const headers = accessToken ? { 'Authorization': `bearer ${accessToken}` } : {};
    const response = await this.request(
      `${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat,node/LinkStation/tempo/latest?limit=-1&select=${select}&where=${where}&distinct=true`,
      { headers }
    );
    if (!response || !response.data) {
      throw new NoiError(LINK_STATION_ERR_NOT_FOUND, {message: `LinkStation ${name} not found`});
    }
    return response.data.map(s => {
      const jam = getJamLevel(jams, s.scode, s.mvalue);
      return {timeSec: s.mvalue, id: s.scode, sync: new Date(s.mvalidtime), jam};
    });
  }

  async getLinkStationsVelocity(ids: Array<string>, auth = false): Promise<Array<{id: string, velocityKmH: number}>> {
    const where = `scode.in.(${ids.join(',')}),mperiod.eq.3600`;
    const select = `mvalue,scode`;
    const accessToken = auth ? await NoiAuth.getValidAccessToken() : null;
    const headers = accessToken ? { 'Authorization': `bearer ${accessToken}` } : {};
    const response = await this.request(
      `${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat,node/LinkStation/velocita'/latest?limit=-1&select=${select}&where=${where}&distinct=true`,
      { headers }
    );
    if (!response || !response.data) {
      throw new NoiError(LINK_STATION_ERR_NOT_FOUND, {message: `LinkStation ${name} not found`});
    }
    if (response.data.length !== ids.length) {
      throw new NoiError(LINK_STATION_VELOCITY_ERR_NOT_FOUND, {message: `Some of LinkStation ids=${ids.join(',')} are not found`});
    }
    return response.data.map(s => ({velocityKmH: s.mvalue, id: s.scode}));
  }

  async getUrbanSegmentsIds(startId: string, endId: string): Promise<Array<string>> {
    if (startId === '1854' && endId === '1853') {
      // BZ SÜD -> BZ NORD
      return [
        'Torricelli->siemens',
        'siemens->Galilei_Palermo',
        'Galilei_Palermo->Galilei_Lancia',
        'Galilei_Lancia->Galilei_Virgolo',
        'Galilei_Virgolo->Galleria_Virgolo',
        'Galleria_Virgolo->P_Campiglio'
      ];
    }
    if (startId === '1853' && endId === '1854') {
      // BZ NORD -> BZ SÜD
      return [
        'P_Campiglio->Galleria_Virgolo',
        'Galleria_Virgolo->Arginale_Palermo',
        'Arginale_Palermo->Arginale_Resia',
        'Arginale_Resia->Agip_Einstein' 
      ];
    }
    return null;
  }

  async getLinkStationsByIds(ids: Array<string>, options?: {auth?: boolean, calcGeometryDistance?: boolean}): Promise<Array<NoiLinkStation>> {
    const where = `egeometry.neq.null,eactive.eq.true,ecode.in.(${ids.join(',')})`;
    const accessToken = options && options.auth ? await NoiAuth.getValidAccessToken() : null;
    const headers = accessToken ? { 'Authorization': `bearer ${accessToken}` } : {};
    const response = await this.request(
      `${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat,edge/LinkStation?where=${where}&limit=-1`,
      { headers }
    );
    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new NoiError(NOI_SERVICE_ERR_DATA_FORMAT, {message: `LinkStations expecting an array response`});
    }
    if (response.data.length !== ids.length) {
      throw new NoiError(LINK_STATION_PATH_ERR_NOT_FOUND, {message: `Some of LinkStation ids=${ids.join(',')} are not found`});
    }
    return response.data.map(getLinkStationParser(options));
  }

  async getHighwayStations(): Promise<Array<NoiHighwayStation>> {
    const where = 'sorigin.eq.A22,sactive.eq.true';
    const response = await this.request(
      `${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat/LinkStation?where=${where}&limit=-1`,
    );
    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new NoiError(NOI_SERVICE_ERR_DATA_FORMAT, {message: `HighwayStations expecting an array response`});
    }
    return parseHighwayStations(response.data);
  }
}

export const NoiAPI = new OpenDataHubNoiService();