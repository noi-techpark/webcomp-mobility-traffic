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
  getBluetoothStations(): Promise<Array<NoiBTStation>>;
  getHighwayStations(): Promise<Array<NoiHighwayStation>>;
  getLinkStationAvgTime(id: string, auth?: boolean): Promise<number>;
  getSegmentsAvgTime(ids: string[], auth?: boolean): Promise<Array<{
    id: string;
    timeSec: number;
  }>>;
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
  position: number;
}
export declare function parseHighwayStations(linkStations: Array<any>): Array<NoiHighwayStation>;
export declare function parse4326Coordinates(value: {
  x: number;
  y: number;
  srid: number;
}): {
  lat: number;
  long: number;
};
export declare function parseBluetoothStation(prefix: any, s: any): NoiBTStation;
export declare function parseLinkStation(s: any): NoiLinkStation;
export declare class OpenDataHubNoiService implements NoiService {
  static BASE_URL: string;
  static VERSION: string;
  request(url: string, init?: RequestInit): Promise<any>;
  getLinkStationAvgTime(id: string, auth?: boolean): Promise<number>;
  getSegmentsAvgTime(ids: Array<string>, auth?: boolean): Promise<Array<{
    id: string;
    timeSec: number;
  }>>;
  getLinkStations(): Promise<Array<NoiLinkStation>>;
  getHighwayStations(): Promise<Array<NoiHighwayStation>>;
  getRoute(startId: string, endId: string): Promise<Array<NoiHighwayStation>>;
  getBluetoothStations(): Promise<Array<NoiBTStation>>;
}
export declare const NoiAPI: NoiService;
