import { createStore } from '@stencil/store';
import { NoiHighwayStation } from '../api';
import { Selectable, WithStartEnd } from '../utils';

export interface NoiState {
  selecting: 'start' | 'end' | null;
  activePath: 'highway' | 'urban';
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
  activePath: 'highway',
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

export function selectStationsWithSelectedWithStartEnd(): WithStartEnd<Selectable<NoiHighwayStation>>[] {
  return !state.stations ? null : state.stationsList.map(s =>
    ({...s,
      selected: s.id === state.selectedId,
      isStart: s.id === state.startId,
      isEnd: s.id === state.endId
    })
  );
}

export function selectStartEnd(): WithStartEnd<Selectable<NoiHighwayStation>>[] {
  return !state.stations ? null : state.stationsList
    .filter(s => s.id === state.startId || s.id === state.endId)
    .map(s =>
      ({...s,
        selected: s.id === state.selectedId,
        isStart: s.id === state.startId,
        isEnd: s.id === state.endId
      })
    );
}

export function selectPathStations(): WithStartEnd<Selectable<NoiHighwayStation>>[] {
  if (!state.stations || !state.startId || !state.endId) {
    return null;
  }
  const startPos = state.start.position;
  const endPos = state.end.position;
  return state.stationsList.reduce<NoiHighwayStation[]>((result, i) => {
    if (startPos < endPos && i.position <= endPos && i.position >= startPos ) {
      result.push({...i});
    }
    if (startPos > endPos && i.position >= endPos && i.position <= startPos ) {
      result.push({...i});
    }
    return result;
  }, [])
  .map(s =>
    ({...s,
      selected: s.id === state.selectedId,
      isStart: s.id === state.startId,
      isEnd: s.id === state.endId
    })
  )
  .sort((a, b) => {
    if (startPos < endPos && a.position > b.position) return 1;
    if (startPos > endPos && a.position < b.position) return 1;
    return -1;
  })
}

export function selectPathSegmentsIds() {
  return selectPathStations().reduce((result, s) => {
    if (!!result.lastId) {
      result.data.push(`${result.lastId}-${s.id}`);
    }
    result.lastId = s.id;
    return result;
  }, {data: [], lastId: ''}).data;
}

export function selectCanLoadPath(): boolean {
  return !!state.startId && !!state.endId;
}

export default state;