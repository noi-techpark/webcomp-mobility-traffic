import { createStore } from '@stencil/store';
import { NoiHighwayStation } from '../api';
import { Selectable } from '../utils';

export interface NoiState {
  selecting: 'start' | 'end' | null;
  selectedId: string;
  startId: string;
  endId: string;
  stations: {[id: string]: NoiHighwayStation},
  readonly start: NoiHighwayStation,
  readonly end: NoiHighwayStation,
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
  selecting: null,
  selectedId: '',
  startId: '',
  endId: '',
  stations: undefined,
  start: null,
  end: null,
  selected: null,
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

onChange('startId', (value) => {
  state.selecting = null;
  if (value) {
    set('start', state.stations[value]);
    if (state.endId === value) {
      set('endId', null);
    }
  } else {
    set('start', null);
  }
});

onChange('endId', (value) => {
  state.selecting = null;
  if (value) {
    set('end', state.stations[value]);
    if (state.startId === value) {
      set('startId', null);
    }
  } else {
    set('end', null);
  }
});

export function selectStationsWithSelected(): Selectable<NoiHighwayStation>[] {
  return !state.stations ? null : state.stationsList.map(s => ({...s, selected: s.id === state.selectedId}));
} 

export default state;