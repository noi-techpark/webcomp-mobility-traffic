import { NoiError, NoiErrorOptionsObject } from "./error";
import L from 'leaflet';

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

export class OpenDataHubNoiService implements NoiService {
  static BASE_URL = 'https://mobility.api.opendatahub.bz.it';
  static VERSION = 'v2';

  public async request(url: string) {
    try {
      const response = await fetch(url);
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