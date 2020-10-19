import { NoiError, NoiErrorOptionsObject } from "./error";
import { NoiAuth } from "./auth";

export const NOI_SERVICE_ERR_UNKNOWN = 'error.noi-service.unknown';
export const NOI_SERVICE_ERR_OFFLINE = 'error.noi-service.offline';
export const NOI_SERVICE_ERR_DATA_FORMAT = 'error.noi-service.data-format';
export const LINK_STATION_ERR_NOT_FOUND = 'error.link-station.not-found';


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

export interface NoiService {
  getBluetoothStations(): Promise<Array<NoiBTStation>>;
  getHighwayStations(): Promise<Array<NoiHighwayStation>>;
  getLinkStationAvgTime(id: string, auth?: boolean): Promise<number>;
  getSegmentsAvgTime(ids: string[], auth?: boolean): Promise<Array<{id: string, timeSec: number}>>;
  getLinkStations(): Promise<Array<NoiLinkStation>>
}

export interface NoiLinkStation {
  type: 'LinkStation',
  available: boolean,
  active: boolean,
  id: string,
  name: string,
  origin: string,
  start: NoiBTStation,
  end: NoiBTStation,
  geometry: GeoJSON.Geometry,
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
  active: boolean;
  available: boolean;
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
    const long = value.x * 180 / 20037508.34;
    const lat = Math.atan(Math.exp(value.y * Math.PI / 20037508.34)) * 360 / Math.PI - 90;
    return {lat, long};
  } catch (error) {
    return null;
  }
}

export function parseBluetoothStation(prefix, s: any): NoiBTStation {
  if (s[`${prefix}type`] !== 'BluetoothStation') {
    return null;
  }
  const coordinates = parse4326Coordinates(s[`${prefix}coordinate`]);
  if (!coordinates) {
    return null;
  }
  return {
    active: !!s[`${prefix}active`],
    available: !!s[`${prefix}available`],
    id: s[`${prefix}code`],
    name: s[`${prefix}name`],
    coordinates,
    type: 'BluetoothStation'
  };
}

export function parseLinkStation(s): NoiLinkStation {
  const start: NoiBTStation = parseBluetoothStation('sb', s);
  const end: NoiBTStation = parseBluetoothStation('se', s);
  return {
    type: 'LinkStation',
    active: !!s.eactive,
    available: !!s.eavailable,
    id: s.ecode,
    name: s.ename,
    origin: s.eorigin,
    geometry: s.egeometry,
    start,
    end
  };
}


export class OpenDataHubNoiService implements NoiService {
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

  async getLinkStationAvgTime(id: string, auth = false): Promise<number> {
    const where = `scode.eq.${id}`;
    const select = `sdatatypes.tempo`;
    const accessToken = auth ? await NoiAuth.getValidAccessToken() : null;
    const headers = accessToken ? { 'Authorization': `bearer ${accessToken}` } : {};
    const response = await this.request(
      `${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat,node/LinkStation/tempo/latest?limit=-1&select=${select}&where=${where}&distinct=true`,
      { headers }
    );
    if (!response || !response.data) {
      throw new NoiError(LINK_STATION_ERR_NOT_FOUND, {message: `LinkStation ${name} not found`});
    }
    return response.data.reduce((result, t) => {result += t.mvalue; return result}, 0);
  }

  async getSegmentsAvgTime(ids: Array<string>, auth = false): Promise<Array<{id: string, timeSec: number}>> {
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
    return response.data.map(s => ({timeSec: s.mvalue, id: s.scode}));
  }


  async getLinkStations(): Promise<Array<NoiLinkStation>> {
    const where = 'egeometry.neq.null,eactive.eq.true';
    const accessToken = await NoiAuth.getValidAccessToken();
    const response = await this.request(
      `${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat,edge/LinkStation?where=${where}&limit=-1`,
      { headers: { 'Authorization': `bearer ${accessToken}` } }
    );
    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new NoiError(NOI_SERVICE_ERR_DATA_FORMAT, {message: `LinkStations expecting an array response`});
    }
    return response.data.map(parseLinkStation);
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

  async getRoute(startId: string, endId: string): Promise<Array<NoiHighwayStation>> {
    const accessToken = await NoiAuth.getValidAccessToken();
    const where = `scode.eq.${startId},sactive.eq.true`;
    const response = await this.request(
      `${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat/LinkStation?where=${where}&limit=-1`,
      { headers: { 'Authorization': `bearer ${accessToken}` } }
    );
    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new NoiError(NOI_SERVICE_ERR_DATA_FORMAT, {message: `HighwayStations expecting an array response`});
    }
    return parseHighwayStations(response.data);
  }

  async getBluetoothStations(): Promise<Array<NoiBTStation>> {
    const response = await this.request(
      `${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/
      tree/BluetoothStation`
    );
    if (!response || !response.data || !response.data.BluetoothStation || !response.data.BluetoothStation.stations) {
      throw new NoiError(NOI_SERVICE_ERR_DATA_FORMAT, {
        message: 'getBluetoothStations expecting an array response in data.BluetoothStation.stations'
      });
    }
    return Object
      .values(response.data.BluetoothStation.stations)
      .map(s => parseBluetoothStation('s', s))
      .filter(s => !!s);
  }
}

export const NoiAPI: NoiService = new OpenDataHubNoiService();