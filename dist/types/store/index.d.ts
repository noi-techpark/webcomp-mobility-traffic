import { NoiHighwayStation } from '../api';
import { Selectable } from '../utils';
export interface NoiState {
  start: NoiHighwayStation;
  end: NoiHighwayStation;
  selectedId: string;
  stations: {
    [id: string]: NoiHighwayStation;
  };
  readonly selected: NoiHighwayStation;
  readonly stationsList: NoiHighwayStation[];
  readonly loading: boolean;
}
declare const state: NoiState;
export declare function selectStationsWithSelected(): Selectable<NoiHighwayStation[]>;
export default state;
