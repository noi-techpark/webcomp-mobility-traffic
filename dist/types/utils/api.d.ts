import { NoiError, NoiErrorOptionsObject } from "./error";
export declare const NOI_SERVICE_ERR_UNKNOWN = "error.noi-service.unknown";
export declare const NOI_SERVICE_ERR_OFFLINE = "error.noi-service.offline";
export declare const NOI_SERVICE_ERR_DATA_FORMAT = "error.noi-service.data-format";
export declare function getErrByServiceError(_: Error): NoiError;
export declare function getErrByStatus(status: number): NoiError;
export interface NoiErrorService {
  show(errCode: string, options?: NoiErrorOptionsObject): any;
  showError(error: NoiError): any;
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
  };
}
export interface NoiBTStation {
  active: boolean;
  available: boolean;
  id: string;
  coordinates: {
    lat: number;
    long: number;
  };
  name: string;
  type: 'BluetoothStation';
}
export interface NoiHighwayStation {
  type: 'VMS';
  id: string;
  active: boolean;
  available: boolean;
  name: string;
  coordinates: {
    lat: number;
    long: number;
  };
  highway: string;
  position: number;
  direction: NoiHighwayStationDirection;
}
export declare type NoiHighwayStationDirection = 'north' | 'south' | 'vehicle' | 'unknown';
export declare function parse4326Coordinates(value: {
  x: number;
  y: number;
  srid: number;
}): {
  lat: number;
  long: number;
};
export declare function parseHighwayStationDirection(s: any): NoiHighwayStationDirection;
export declare function parseVmsPosition(s: {
  scode: string;
  smetadata: any;
}): number;
export declare class OpenDataHubNoiService implements NoiService {
  static BASE_URL: string;
  static VERSION: string;
  request(url: string, init?: RequestInit): Promise<any>;
  getHighwayStations(): Promise<Array<NoiHighwayStation>>;
  getTree(): Promise<Array<NoiTreeItem>>;
  getBluetoothStations(): Promise<Array<NoiBTStation>>;
}
export declare const NoiAPI: NoiService;
