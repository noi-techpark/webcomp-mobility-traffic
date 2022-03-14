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

export type StringMap<T> = { [id: string]: T };
export type StringNumberMap = StringMap<number>;

export interface NoiJams {
  [stationId: string]: [number, number]
}

export function selectSegmentsGeometries(segmentsIds: Array<string>, geometries: any): { [id: string]: { name: string, geometry: any } } {
  if (!segmentsIds || !segmentsIds.length) {
    return {};
  }
  return segmentsIds.reduce((result, id) => {
    if (geometries[id] && geometries[id].geometry) {
      result[id] = geometries[id];
    }
    return result;
  }, {} as { [id: string]: { name: string, geometry: any } });
}

export function validateUrbanSegmentsIds(data: unknown): Array<string> {
  if (!data) {
    return null;
  }
  if (!Array.isArray(data)) {
    throw new NoiError('error.urban-segments-validation');
  }
  (data as Array<unknown>).forEach(i => {
    if (typeof i !== 'string') {
      throw new NoiError('error.urban-segments-validation');
    }
  });
  return data as Array<string>;
}

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
  distance?: number,
  jamLevel?: JamLevel,
  timeSec?: number
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
  coordinates: { lat: number; long: number };
  name: string;
  type: 'BluetoothStation'
}

export interface NoiHighwayStation {
  id: string;
  name: string;
  coordinates: { lat: number; long: number };
  highway: 'A22';
  position: number;
};

export type JamLevel = '' | 'light' | 'strong';

export function getJamLevel(jams: { [id: string]: [number, number] }, id: string, velocity: number): JamLevel {
  if (!jams || !jams[id] || !Array.isArray(jams[id]) || jams[id].length !== 2 || velocity === undefined) {
    return undefined;
  }
  const j = jams[id];
  if (velocity > j[1]) {
    return '';
  }
  if (velocity > j[0]) {
    return 'light';
  }
  return 'strong';
}

export function parseHighwayStations(linkStations: Array<any>): Array<NoiHighwayStation> {
  const stations = linkStations.reduce<{ [id: string]: NoiHighwayStation }>((result, s) => {
    if (
      !s ||
      typeof (s.scode) !== 'string' ||
      typeof (s.sname) !== 'string' ||
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
    const coordinates: { lat: number, long: number }[] = [
      { lat: s.smetadata.latitudineinizio, long: s.smetadata.longitudininizio },
      { lat: s.smetadata.latitudinefine, long: s.smetadata.longitudinefine },
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

export function parse4326Coordinates(value: { x: number, y: number; srid: number }): { lat: number; long: number } {
  if (!value || value.srid !== 4326) {
    return null;
  }
  try {
    const long = +value.x * 180 / 20037508.34;
    const lat = Math.atan(Math.exp(+value.y * Math.PI / 20037508.34)) * 360 / Math.PI - 90;
    return { lat, long };
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
  const coordinates = { lat: s[`${prefix}coordinate`].y, long: s[`${prefix}coordinate`].x };
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
  return (value.coordinates as Array<[number, number]>).reduce<{ prev: [number, number], distance: number }>((result, i) => {
    if (result.prev !== null) {
      result.distance += getPointsDistance(result.prev, i);
    }
    result.prev = i;
    return result;
  }, { prev: null, distance: 0 }).distance;
}

function getLinkStationParser(options?: { calcGeometryDistance?: boolean }) {
  return (s: any) => {
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
  static ORIGIN = '&origin=webcomp-mobility-traffic';
  private jams = undefined;
  private timeThresholds = undefined;
  private urbanSegments = undefined;
  private geometries = undefined;

  public async request(url: string, init: RequestInit = {}) {
    try {
      const response = await fetch(url, init);
      if (!response.ok) {
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

  async fetchJamThresholds(): Promise<NoiJams> {
    try {
      if (this.jams) {
        return this.jams;
      }
      const response = await fetch(getAssetPath('./jams.json'));
      if (!response.ok) {
        throw new NoiError('error.jams-not-available');
      }
      const json = await response.json() || {};
      this.jams = json;
      return json;
    } catch (err) {
      if (err instanceof NoiError) {
        throw err;
      }
      const noiErr = getErrByServiceError(err);
      throw noiErr;
    }
  }

  async fetchTimeThresholds(): Promise<StringNumberMap> {
    try {
      if (this.timeThresholds) {
        return this.timeThresholds;
      }
      const response = await fetch(getAssetPath('./time-thresholds.json'));
      if (!response.ok) {
        throw new NoiError('error.time-thresholds-not-available');
      }
      const json = await response.json() || {};
      this.timeThresholds = json;
      return json;
    } catch (err) {
      if (err instanceof NoiError) {
        throw err;
      }
      const noiErr = getErrByServiceError(err);
      throw noiErr;
    }
  }

  async getLinkStationsTime(ids: Array<string>, auth = false): Promise<Array<{ id: string, timeSec: number, sync: Date }>> {
    const where = `scode.in.(${ids.join(',')})`;
    const select = `scode,sdatatypes.tempo`;
    const accessToken = auth ? await NoiAuth.getValidAccessToken() : null;
    const headers = accessToken ? { 'Authorization': `bearer ${accessToken}` } : {};
    const response = await this.request(
      `${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat,node/LinkStation/tempo/latest?limit=-1&select=${select}&where=${where}&distinct=true` + OpenDataHubNoiService.ORIGIN,
      { headers }
    );
    if (!response || !response.data) {
      throw new NoiError(LINK_STATION_ERR_NOT_FOUND, { message: `LinkStation ${name} not found` });
    }
    return response.data.map(s => {
      return { timeSec: s.mvalue, id: s.scode, sync: new Date(s.mvalidtime) };
    });
  }

  async getLinkStationsHistoryTime(ids: Array<string>, auth = false): Promise<StringMap<{ id: string, timeSec: number, sync: Date }>> {
    const from = new Date();
    from.setDate(from.getDate() - 1);
    from.setHours(0, 0, 0);
    const fromString = from.toISOString();
    const to = new Date();
    from.setHours(23, 59, 59);
    const toString = to.toISOString();
    const where = `scode.in.(${ids.join(',')})`;
    const select = `scode,sdatatypes.tempo`;
    const limit = -1;
    const accessToken = auth ? await NoiAuth.getValidAccessToken() : null;
    const headers = accessToken ? { 'Authorization': `bearer ${accessToken}` } : {};
    const response = await this.request(
      `${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat,node/LinkStation/tempo/${fromString}/${toString}?limit=${limit}&select=${select}&where=${where}&distinct=true` + OpenDataHubNoiService.ORIGIN,
      { headers }
    );
    if (!response || !response.data) {
      throw new NoiError(LINK_STATION_ERR_NOT_FOUND, { message: `LinkStation ${name} not found` });
    }
    const res: { [key: string]: Array<{ id: string, timeSec: number, sync: Date }> } = response.data.reduce((result, i) => {
      result[i.scode] = result[i.scode] || [];
      result[i.scode].push({ timeSec: i.mvalue, id: i.scode, sync: new Date(i.mvalidtime) });
      return result;
    }, {});
    return Object.keys(res).reduce((result, i) => {
      const secondLast = res[i].length > 1 ? res[i][res[i].length - 2] : res[i][res[i].length - 1];
      result[i] = secondLast;
      return result;
    }, {});
  }

  async getLinkStationsVelocity(ids: Array<string>, auth = false): Promise<Array<{ id: string, velocityKmH: number, syncDate?: Date }>> {
    const where = `scode.in.(${ids.join(',')}),mperiod.eq.3600`;
    const select = `mvalue,scode,mvalidtime`;
    const accessToken = auth ? await NoiAuth.getValidAccessToken() : null;
    const headers = accessToken ? { 'Authorization': `bearer ${accessToken}` } : {};
    const response = await this.request(
      `${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat,node/LinkStation/velocita'/latest?limit=-1&select=${select}&where=${where}&distinct=true` + OpenDataHubNoiService.ORIGIN,
      { headers }
    );
    if (!response || !response.data) {
      throw new NoiError(LINK_STATION_ERR_NOT_FOUND, { message: `LinkStation ${name} not found` });
    }
    if (response.data.length !== ids.length) {
      throw new NoiError(LINK_STATION_VELOCITY_ERR_NOT_FOUND, { message: `Some of LinkStation ids=${ids.join(',')} are not found` });
    }
    return response.data.map(s => ({ velocityKmH: s.mvalue, id: s.scode, syncDate: s.mvalidtime ? new Date(s.mvalidtime) : undefined }));
  }

  async getUrbanSegmentsIds(startId: string, endId: string): Promise<Array<string>> {
    if (this.urbanSegments) {
      return validateUrbanSegmentsIds(this.urbanSegments[`${startId}->${endId}`]);
    }
    try {
      const response = await fetch(getAssetPath('./urban-segments.json'));
      if (response.ok) {
        const json = await response.json() || {};
        this.urbanSegments = json;
        return validateUrbanSegmentsIds(json[`${startId}->${endId}`]);
      }
      throw new NoiError('error.urban-segments');
    } catch (error) {
      if (error instanceof NoiError) {
        throw error;
      }
      throw new NoiError('error.urban-segments');
    }
  }

  async getPathGeometries(segmentsIds: Array<string>): Promise<{ [id: string]: { name: string, geometry: any } }> {
    if (this.geometries) {
      return selectSegmentsGeometries(segmentsIds, this.geometries);
    }
    try {
      await this.fetchGeometries();
      await this.fetchFallbackGeometries();
      return selectSegmentsGeometries(segmentsIds, this.geometries);
    } catch (error) {
      if (error instanceof NoiError) {
        throw error;
      }
      throw new NoiError('error.geometries');
    }
  }

  async fetchGeometries(): Promise<void> {
    try {
      const where = `egeometry.neq.null,eactive.eq.true`;
      const response = await this.request(
        `${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat,edge/LinkStation?where=${where}&limit=-1` + OpenDataHubNoiService.ORIGIN,
        {}
      );
      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new NoiError(NOI_SERVICE_ERR_DATA_FORMAT, { message: `LinkStations expecting an array response` });
      }
      this.geometries = (response.data as Array<any>).map(getLinkStationParser({ calcGeometryDistance: true })).reduce(
        (result, i) => { result[i.id] = i; return result; },
        {}
      );
    } catch (error) {
      if (error instanceof NoiError) {
        throw error;
      }
      throw new NoiError('error.geometries');
    }
  }

  async fetchFallbackGeometries(): Promise<void> {
    try {
      const response = await fetch(getAssetPath('./geometries.json'));
      if (!response.ok) {
        throw new NoiError('error.geometries');
      }
      const json = await response.json() || {};
      this.geometries = this.geometries || {};
      Object.keys(json).forEach(id => {
        if (!this.geometries[id]) {
          this.geometries[id] = json[id];
        }
      });
    } catch (error) {
      if (error instanceof NoiError) {
        throw error;
      }
      throw new NoiError('error.geometries');
    }
  }

  async getLinkStationsByIds(ids: Array<string>, options?: { auth?: boolean, calcGeometryDistance?: boolean }): Promise<Array<NoiLinkStation>> {
    const where = `egeometry.neq.null,eactive.eq.true,ecode.in.(${ids.join(',')})`;
    const accessToken = options && options.auth ? await NoiAuth.getValidAccessToken() : null;
    const headers = accessToken ? { 'Authorization': `bearer ${accessToken}` } : {};
    const response = await this.request(
      `${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat,edge/LinkStation?where=${where}&limit=-1` + OpenDataHubNoiService.ORIGIN,
      { headers }
    );
    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new NoiError(NOI_SERVICE_ERR_DATA_FORMAT, { message: `LinkStations expecting an array response` });
    }
    if (response.data.length !== ids.length) {
      throw new NoiError(LINK_STATION_PATH_ERR_NOT_FOUND, { message: `Some of LinkStation ids=${ids.join(',')} are not found` });
    }
    const stationsMap = (response.data as Array<unknown>).map(getLinkStationParser(options)).reduce(
      (result, i) => { result[i.id] = i; return result; },
      {}
    );
    return ids.map(i => stationsMap[i]);
  }

  async getHighwayStations(): Promise<Array<NoiHighwayStation>> {
    const where = 'sorigin.eq.A22,sactive.eq.true';
    const response = await this.request(
      `${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat/LinkStation?where=${where}&limit=-1` + OpenDataHubNoiService.ORIGIN,
    );
    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new NoiError(NOI_SERVICE_ERR_DATA_FORMAT, { message: `HighwayStations expecting an array response` });
    }
    return parseHighwayStations(response.data);
  }
}

export const NoiAPI = new OpenDataHubNoiService();