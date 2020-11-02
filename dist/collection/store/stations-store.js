import { createStore } from '@stencil/store';
function orderStations(value) {
  return Object.keys(value)
    .map(i => value[i])
    .sort((a, b) => a.position > b.position ? 1 : -1);
}
const { state, onChange, set } = createStore({
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
  mapCenter: { lat: 46.4983, long: 11.3548 }
});
onChange('stations', (stations) => {
  if (stations) {
    set('loading', false);
    set('stationsList', orderStations(stations));
  }
  else {
    set('stationsList', null);
    set('loading', true);
  }
});
onChange('selectedId', (selectedId) => {
  if (selectedId) {
    set('selected', state.stations[selectedId]);
  }
  else {
    set('selected', null);
    set('mapPopup', false);
  }
});
onChange('selected', (selected) => {
  if (selected) {
    set('mapCenter', Object.assign({}, selected.coordinates));
  }
});
onChange('startId', (value) => {
  state.selecting = null;
  if (value) {
    set('start', state.stations[value]);
    if (state.endId === value) {
      set('endId', null);
    }
  }
  else {
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
  }
  else {
    set('end', null);
  }
});
export function selectStationsWithSelected() {
  return !state.stations ? null : state.stationsList.map(s => (Object.assign(Object.assign({}, s), { selected: s.id === state.selectedId })));
}
export function selectStationsWithSelectedWithStartEnd() {
  return !state.stations ? null : state.stationsList.map(s => (Object.assign(Object.assign({}, s), { selected: s.id === state.selectedId, isStart: s.id === state.startId, isEnd: s.id === state.endId })));
}
export function selectStartEnd() {
  return !state.stations ? null : state.stationsList
    .filter(s => s.id === state.startId || s.id === state.endId)
    .map(s => (Object.assign(Object.assign({}, s), { selected: s.id === state.selectedId, isStart: s.id === state.startId, isEnd: s.id === state.endId })));
}
export function selectPathStations() {
  if (!state.stations || !state.startId || !state.endId) {
    return null;
  }
  const startPos = state.start.position;
  const endPos = state.end.position;
  return state.stationsList.reduce((result, i) => {
    if (startPos < endPos && i.position <= endPos && i.position >= startPos) {
      result.push(Object.assign({}, i));
    }
    if (startPos > endPos && i.position >= endPos && i.position <= startPos) {
      result.push(Object.assign({}, i));
    }
    return result;
  }, [])
    .map(s => (Object.assign(Object.assign({}, s), { selected: s.id === state.selectedId, isStart: s.id === state.startId, isEnd: s.id === state.endId })))
    .sort((a, b) => {
    if (startPos < endPos && a.position > b.position)
      return 1;
    if (startPos > endPos && a.position < b.position)
      return 1;
    return -1;
  });
}
export function selectPathSegmentsIds() {
  return selectPathStations().reduce((result, s) => {
    if (!!result.lastId) {
      result.data.push(`${result.lastId}-${s.id}`);
    }
    result.lastId = s.id;
    return result;
  }, { data: [], lastId: '' }).data;
}
export function selectCanLoadPath() {
  return !!state.startId && !!state.endId;
}
export default state;
