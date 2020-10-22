import { NoiHighwayStation } from '../api';
import { Selectable, WithStartEnd } from '../utils';
export interface NoiState {
  selecting: 'start' | 'end' | null;
  activePath: 'highway' | 'urban';
  selectedId: string;
  startId: string;
  endId: string;
  stations: {
    [id: string]: NoiHighwayStation;
  };
  readonly start: NoiHighwayStation;
  readonly end: NoiHighwayStation;
  readonly selected: NoiHighwayStation;
  readonly stationsList: NoiHighwayStation[];
  readonly loading: boolean;
}
declare const state: NoiState;
export declare function selectStationsWithSelected(): Selectable<NoiHighwayStation>[];
export declare function selectStationsWithSelectedWithStartEnd(): WithStartEnd<Selectable<NoiHighwayStation>>[];
export declare function selectStartEnd(): WithStartEnd<Selectable<NoiHighwayStation>>[];
export declare function selectPathStations(): WithStartEnd<Selectable<NoiHighwayStation>>[];
export declare function selectPathSegmentsIds(): any[];
export declare function selectCanLoadPath(): boolean;
export default state;
