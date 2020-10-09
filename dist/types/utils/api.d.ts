import { NoiError, NoiErrorOptionsObject } from "./error";
export declare const NOI_SERVICE_ERR_UNKNOWN = "error.noi-service.unknown";
export declare const NOI_SERVICE_ERR_OFFLINE = "error.noi-service.offline";
export declare const NOI_SERVICE_ERR_DATA_FORMAT = "error.noi-service.data-format";
export declare const LINK_STATION_ERR_NOT_FOUND = "error.link-station.not-found";
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
  getVMSs(): Promise<Array<NoiVMS>>;
  getLinkStation(id: string): Promise<NoiLinkStation>;
  getLinkStations(): Promise<Array<NoiLinkStation>>;
}
export interface NoiLinkStation {
  type: 'LinkStation';
  available: boolean;
  active: boolean;
  id: string;
  name: string;
  origin: string;
  start: NoiBTStation;
  end: NoiBTStation;
  geometry: GeoJSON.Geometry;
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
  id: string;
  name: string;
  coordinates: {
    lat: number;
    long: number;
  };
  highway: 'A22';
}
export declare function parseHighwayStations(linkStations: Array<any>): Array<NoiHighwayStation>;
export interface NoiVMS {
  type: 'VMS';
  id: string;
  name: string;
  coordinates: {
    lat: number;
    long: number;
  };
  highway: string;
  position: number;
  direction: NoiVMSDirection;
}
export declare type NoiVMSDirection = 'north' | 'south' | 'vehicle' | 'unknown';
export declare function parse4326Coordinates(value: {
  x: number;
  y: number;
  srid: number;
}): {
  lat: number;
  long: number;
};
export declare function parsVMSDirection(s: any): NoiVMSDirection;
export declare function parseBluetoothStation(prefix: any, s: any): NoiBTStation;
export declare function parseLinkStation(s: any): NoiLinkStation;
export declare function parseVmsPosition(s: {
  scode: string;
  smetadata: any;
}): number;
export declare class OpenDataHubNoiService implements NoiService {
  static BASE_URL: string;
  static VERSION: string;
  request(url: string, init?: RequestInit): Promise<any>;
  getLinkStation(id: string): Promise<NoiLinkStation>;
  getLinkStations(): Promise<Array<NoiLinkStation>>;
  getHighwayStations(): Promise<Array<NoiHighwayStation>>;
  getVMSs(): Promise<Array<NoiVMS>>;
  getTree(): Promise<Array<NoiTreeItem>>;
  getBluetoothStations(): Promise<Array<NoiBTStation>>;
}
export declare const NoiAPI: NoiService;
