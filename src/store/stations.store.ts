import { createStore } from '@stencil/store';
import { NoiHighwayStation } from '../api';
import { Selectable, WithStartEnd } from '../utils';
import { pathState } from './path.store';
import { urbanPathState } from './urban-path.store';

export interface NoiState {
  selecting: 'start' | 'end' | null;
  activePath: 'highway' | 'urban';
  mapPopup: boolean;
  selectedId: string;
  startId: string;
  endId: string;
  stations: {[id: string]: NoiHighwayStation},
  readonly mapCenter: {lat: number, long: number};
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
  mapPopup: false,
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
  loading: true,
  mapCenter: {lat: 46.4983, long: 11.3548}
});


onChange('stations', (stations) => {
  if (!stations) {
    pathState.segments = undefined;
    set('stationsList', null);
    set('loading', true);
    return;
  }
  set('loading', false);
  set('stationsList', orderStations(stations));
  if (state.startId && state.endId) {
    pathState.segments = selectPathSegments();
  }
});

onChange('selectedId', (selectedId) => {
  if (selectedId) {
    set('selected', state.stations[selectedId]);
  } else {
    set('selected', null);
    set('mapPopup', false);
  }
});

onChange('selected', (selected) => {
  if (selected) {
    set('mapCenter', {...selected.coordinates});
  }
});


onChange('startId', (value) => {
  state.selecting = null;
  if (!value) {
    set('start', null);
    pathState.segments = undefined;
    return;
  }
  set('start', state.stations[value]);
  if (state.endId === value) {
    set('endId', null);
  } else {
    if (state.endId) {
      // if have both start and end
      pathState.segments = selectPathSegments();
      urbanPathState.startEnd = [value, state.endId];
    }
  }
});

onChange('endId', (value) => {
  state.selecting = null;
  if (!value) {
    set('end', null);
    pathState.segments = undefined;
    return;
  }
  set('end', state.stations[value]);
  if (state.startId === value) {
    set('startId', null);
  } else {
    if (state.startId) {
      // if have both start and end
      pathState.segments = selectPathSegments();
      urbanPathState.startEnd = [state.startId, value];
    }
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

export function selectPathSegments() {
  if (!state.stations || !state.startId || !state.endId) {
    return undefined;
  }
  const startPos = state.start.position;
  return selectPathStations().reduce((result, s) => {
    if (!!result.lastId) {
      
      result.data.push({id: `${result.lastId}-${s.id}`, length: Math.abs(startPos - s.position)});
    }
    result.lastId = s.id;
    return result;
  }, {data: [] as Array<{id: string, length: number}>, lastId: ''}).data;
}

export function selectCanLoadPath(): boolean {
  return !!state.startId && !!state.endId;
}

export default state;