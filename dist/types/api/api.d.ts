import { NoiError, NoiErrorOptionsObject } from "./error";
export declare const NOI_SERVICE_ERR_UNKNOWN = "error.noi-service.unknown";
export declare const NOI_SERVICE_ERR_OFFLINE = "error.noi-service.offline";
export declare const NOI_SERVICE_ERR_DATA_FORMAT = "error.noi-service.data-format";
export declare const LINK_STATION_ERR_NOT_FOUND = "error.link-station.not-found";
export declare const LINK_STATION_PATH_ERR_NOT_FOUND = "error.link-station-path.not-found";
export declare function getErrByServiceError(_: Error): NoiError;
export declare function getErrByStatus(status: number): NoiError;
export interface NoiErrorService {
  show(errCode: string, options?: NoiErrorOptionsObject): any;
  showError(error: NoiError): any;
}
export interface NoiLinkStation {
  type: 'LinkStation';
  id: string;
  name: string;
  origin: string;
  start: NoiBTStation;
  end: NoiBTStation;
  geometry: GeoJSON.Geometry;
  distance?: number;
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
export declare class OpenDataHubNoiService {
  static BASE_URL: string;
  static VERSION: string;
  request(url: string, init?: RequestInit): Promise<any>;
  getLinkStationsTime(ids: Array<string>, auth?: boolean): Promise<Array<{
    id: string;
    timeSec: number;
  }>>;
  getUrbanSegmentsIds(startId: string, endId: string): Promise<Array<string>>;
  getLinkStationsByIds(ids: Array<string>, options?: {
    auth?: boolean;
    calcGeometryDistance?: boolean;
  }): Promise<Array<NoiLinkStation>>;
  getHighwayStations(): Promise<Array<NoiHighwayStation>>;
}
export declare const NoiAPI: OpenDataHubNoiService;
