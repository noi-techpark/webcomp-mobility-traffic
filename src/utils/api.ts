import { NoiError, NoiErrorOptionsObject } from "./error";
import L from 'leaflet';
import { NoiAuth } from "./auth";

export const NOI_SERVICE_ERR_UNKNOWN = 'error.noi-service.unknown';
export const NOI_SERVICE_ERR_OFFLINE = 'error.noi-service.offline';
export const NOI_SERVICE_ERR_DATA_FORMAT = 'error.noi-service.data-format';

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
  getTree(): Promise<any>;
  getBluetoothStations(): Promise<Array<NoiBTStation>>;
  getHighwayStations(): Promise<Array<NoiHighwayStation>>;
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
  type: 'VMS';
  id: string;
  active: boolean;
  available: boolean;
  name: string;
  coordinates: {lat: number; long: number};
  highway: string;
  position: number;
  direction: NoiHighwayStationDirection;
};

export type NoiHighwayStationDirection = 'north' | 'south' | 'vehicle' | 'unknown';

export function parse4326Coordinates(value: {x: number, y: number; srid: number}): {lat: number; long: number} {
  if (!value || value.srid !== 4326) {
    return null;
  }
  try {
    const result = new L.latLng(value.x, value.y);
    return {lat: result.lat, long: result.lng};
  } catch (error) {
    return null;
  }
}

export function parseHighwayStationDirection(s: any): NoiHighwayStationDirection {
  if (!s || !s.smetadata || !s.smetadata.direction_id) {
    return 'unknown';
  }
  switch (s.smetadata.direction_id) {
    case '1':
      return 'north';
    case '2':
      return 'south';
    case '3':
      return 'vehicle';
    default:
      return 'unknown';
  }
}

export function parseVmsPosition(s: {scode: string, smetadata: any}): number {
  if (s.scode.startsWith('A22:5515')) {
    return 33000;
  }
  if (s.scode.startsWith('A22:5514')) {
    return 119600;
  }
  if (s.scode.startsWith('A22:5514')) {
    return 119600;
  }
  if (s.scode.startsWith('A22:2014')) {
    return 136500;
  }
  if (s.scode.startsWith('A22:2015')) {
    return 136500;
  }
  if (s.scode.startsWith('A22:2018')) {
    return 136500;
  }
  if (s.scode.startsWith('A22:2020')) {
    return 136500;
  }
  return s.smetadata ? +s.smetadata.position_m : 0;
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

  async getHighwayStations(): Promise<Array<NoiHighwayStation>> {
    const accessToken = await NoiAuth.getValidAccessToken();
    const select = 'sactive,stype,savailable,scoordinate,scode,sname,smetadata';
    const limit = -1;
    const response = await this.request(
      `${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat/VMS/*?select=${select}&limit=${limit}`,
      { headers: { 'Authorization': `bearer ${accessToken}` } }
    );
    const stations: Array<NoiHighwayStation> = Object.values(response.data)
    .map((s: any) => {
      const code = s.scode.split(':');
      const highway = code[0];
      const id = s.scode;
      const coordinates = parse4326Coordinates(s.scoordinate);
      if (!coordinates) {
        return null;
      }
      return {
        active: !!s.sactive,
        available: !!s.savailable,
        id,
        highway,
        name: s.sname.slice(0, -13),
        coordinates,
        type: 'VMS',
        position: parseVmsPosition(s),
        direction: parseHighwayStationDirection(s)
      };
    });
    return stations
    .filter(s => !!s && !(['A22:2014:2', 'A22:2014:1', 'A22:2014:3'].includes(s.id)))
    .sort((a, b) => {
      if (a.position > b.position) {
        return 1;
      }
      if (a.position < b.position) {
        return -1;
      }
      return 0;
    });
  }

  async getTree(): Promise<Array<NoiTreeItem>> {
    const response = await this.request(`${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/tree`);
    if (!Array.isArray(response)) {
      throw new NoiError(NOI_SERVICE_ERR_DATA_FORMAT, {message: 'getTree expecting an array response'});
    }
    return response;
  }

  async getBluetoothStations(): Promise<Array<NoiBTStation>> {
    const response = await this.request(`${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/tree/BluetoothStation`);
    if (!response || !response.data || !response.data.BluetoothStation || !response.data.BluetoothStation.stations) {
      throw new NoiError(NOI_SERVICE_ERR_DATA_FORMAT, {message: 'getBluetoothStations expecting an array response in data.BluetoothStation.stations'});
    }
    const stations: Array<NoiBTStation> = Object.values(response.data.BluetoothStation.stations).map((s: any) => {
      const coordinates = parse4326Coordinates(s.scoordinate);
      if (!coordinates) {
        return null;
      }
      return {
        active: !!s.sactive,
        available: !!s.savailable,
        id: s.scode,
        name: s.sname,
        coordinates,
        type: 'BluetoothStation'
      };
    });
    return stations.filter(s => !!s);
  }
}

export const NoiAPI: NoiService = new OpenDataHubNoiService();