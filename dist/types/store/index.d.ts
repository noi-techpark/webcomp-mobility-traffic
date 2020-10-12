import { NoiHighwayStation } from '../api';
import { Selectable } from '../utils';
export interface NoiState {
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
export declare function selectStationsWithSelected(): Selectable<NoiHighwayStation[]>;
export default state;
