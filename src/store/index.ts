import { createStore } from '@stencil/store';
import { NoiHighwayStation } from '../api';
import { Selectable } from '../utils';

export interface NoiState {
  start: NoiHighwayStation,
  end: NoiHighwayStation,
  selectedId: string;
  stations: {[id: string]: NoiHighwayStation},
  readonly selected: NoiHighwayStation,
  readonly stationsList:  NoiHighwayStation[],
  readonly loading: boolean
}

function orderStations(value:{[id: string]: NoiHighwayStation}) {
  return Object.keys(value)
    .map(i => value[i])
    .sort((a, b) => a.position > b.position ? 1 : -1);
}

const { state, onChange, set } = createStore<NoiState>({
  start: null,
  end: null,
  selected: null,
  selectedId: '',
  stations: undefined,
  stationsList: null,
  loading: true
});

onChange('stations', (stations) => {
  if (stations) {
    set('loading', false);
    set('stationsList', orderStations(stations));
  } else {
    set('stationsList', null);
    set('loading', true);
  }
});

onChange('selectedId', (selectedId) => {
  if (selectedId) {
    set('selected', state.stations[selectedId]);
  } else {
    set('selected', null);
  }
});

export function selectStationsWithSelected(): Selectable<NoiHighwayStation[]> {
  return !state.stations ? null : state.stationsList.map(s => ({...s, selected: s.id === state.selectedId}));
} 

export default state;