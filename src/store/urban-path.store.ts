import { NoiError, NOI_ERR_UNKNOWN } from '@noi/api/error';
import { createStore } from '@stencil/store';
import { CancellablePromise, cancellablePromise, NoiCoordinate } from '@noi/utils';
import { getJamLevel, NoiAPI, NoiLinkStation } from '../api';

export interface NoiPathState {
  startEnd: [string, string];
  selectedId: string;
  readonly path: Array<NoiLinkStation>;
  readonly loading: boolean;
  readonly errorCode: string;
  readonly stations: Array<{timeSec: number, position: number, id: string, name: string, coordinates: NoiCoordinate}>;
  readonly durationMin: number;
  readonly distance: number;
  readonly syncDate: Date;
}

const urbanPathStore = createStore<NoiPathState>({
  startEnd: undefined,
  selectedId: undefined,
  path: undefined,
  loading: false,
  errorCode: undefined,
  stations: undefined,
  durationMin: undefined,
  distance: undefined,
  syncDate: undefined,
});

const { onChange, set, state } = urbanPathStore;

let effectPromise: CancellablePromise<UrbanPathEffectData> = undefined;

onChange('path', (path) => {
  if (!path || !path.length) {
    set('stations', undefined);
    return;
  }
  const stations = path.reduce((result, i) => {
    result.push({
      position: result[result.length-1].position + i.distance,
      id: i.end.id,
      name: i.end.name,
      coordinates: i.end.coordinates,
      timeSec: i.timeSec
    });
    return result;
  }, [{timeSec: 0, position: 0, name: path[0].start.name, id: path[0].start.id, coordinates: path[0].start.coordinates}]);
  set('stations', stations);
});

onChange('stations', (value) => {
  const distance = value && value.length ? value[value.length-1].position : undefined;
  set('distance', Math.round(distance));
})

onChange('startEnd', (value) => {
  set('path', undefined);
  set('durationMin', undefined);
  set('errorCode', undefined);
  if (!!value) {
    loadUrbanPath(...value);
  }
});

async function loadJams() {
  try {
    return await NoiAPI.fetchJamThresholds();
  } catch (error) {
    return undefined;
  }
}

function loadUrbanPath(startId: string, endId: string): void {
  set('loading', true);
  set('errorCode', undefined);
  if (effectPromise) {
    effectPromise.cancel()
  }
  effectPromise = cancellablePromise(loadUrbanPathEffect(startId, endId));
  effectPromise.promise
    .then(data => {
      set('loading', false);
      effectPromise = undefined;
      if (data === undefined) {
        return;
      }
      set('path', data.path);
      set('durationMin', data.timeMin);
      set('syncDate', data.syncDate);
    })
    .catch(err => {
      if (err.isCancelled) {
        return;
      }
      effectPromise = undefined;
      set('loading', false);
      if (err instanceof NoiError) {
        set('errorCode', (err as NoiError).code);
      } else {
        set('errorCode', NOI_ERR_UNKNOWN);
      }
    });
}

export const urbanPathState = state;

export type TimeMap = {[id: string]: number};

export interface UrbanPathEffectData {
  path: Array<NoiLinkStation>;
  timeMin: number;
  syncDate: Date;
}

/**
 * it's like a Redux Effect to load external data in async way
 */
async function loadUrbanPathEffect(startId: string, endId: string): Promise<UrbanPathEffectData> {
  const segmentsIds = await NoiAPI.getUrbanSegmentsIds(startId, endId);
  const jams = await loadJams();
  if (!segmentsIds) {
    return undefined;
  }
  const path =  await NoiAPI.getLinkStationsByIds(segmentsIds, {calcGeometryDistance: true});
  const velocityInfo = await NoiAPI.getLinkStationsVelocity(path.map(i => i.id));
  const velocityMap = velocityInfo.reduce(
    (result, i) => { result[i.id] = i.velocityKmH; return result;},
    {}
  );
  const timeMin = path.reduce((result, i) => {
    const timeMin = Math.round((i.distance / (1000 * velocityMap[i.id])) * 60);
    result += timeMin;
    return result;
  }, 0);
  const pathWithJamsAndTime = path.map(i => {
    const jamLevel = getJamLevel(jams, i.id, velocityMap[i.id]);
    const timeSec = Math.round((i.distance / (1000 * velocityMap[i.id])) * 60 * 60);
    return {...i, jamLevel, timeSec}
  });
  const syncDate = Math.min(...velocityInfo.filter(Boolean).map(i => i.syncDate.getTime()))
  return {path: pathWithJamsAndTime, timeMin, syncDate: syncDate ? new Date(syncDate) : undefined}
}

