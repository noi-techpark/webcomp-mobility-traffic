import { NoiError } from '@noi/api/error';
import { createStore } from '@stencil/store';
import { CancellablePromise, cancellablePromise } from '@noi/utils';
import { NoiAPI, NoiJams, NoiLinkStation } from '../api';

export interface NoiPathState {
  segmentsIds: Array<string>;
  readonly path: Array<NoiLinkStation>;
  readonly pathError: string;
  readonly jams: NoiJams;
  readonly loading: boolean;
  readonly errorCode: string;
  readonly durationMin: number;
  readonly syncDate: Date;
  readonly segmentsTime: {[id: string]: number};
}

const pathStore = createStore<NoiPathState>({
  segmentsIds: undefined,
  path: undefined,
  pathError: undefined,
  jams: undefined,
  loading: false,
  errorCode: undefined,
  syncDate: undefined,
  durationMin: undefined,
  segmentsTime: undefined
});

const { onChange, set, state } = pathStore;

let pathDetailsPromise: CancellablePromise<{syncDate: Date, timeMin: number, segmentsTime: {[id: string]: number}}> = undefined;
let pathPromise: CancellablePromise<Array<NoiLinkStation>> = undefined;

loadJams();


onChange('segmentsIds', (value) => {
  if (!!value && value.length) {
    loadPath(value);
  }
});

function loadJams() {
  NoiAPI.fetchJamThresholds()
    .then(jams => {
      set('jams', jams);
    })
    .catch(_ => {});
}

function loadPath(segmentsIds: Array<string>): void {
  set('loading', true);
  set('errorCode', undefined);
  set('durationMin', undefined);
  set('segmentsTime', undefined);
  set('syncDate', undefined);
  set('path', undefined);
  set('pathError', undefined);
  
  if (pathDetailsPromise) {
    pathDetailsPromise.cancel()
  }
  if (pathPromise) {
    pathPromise.cancel()
  }
  pathPromise = cancellablePromise(loadPathEffect(segmentsIds));
  pathPromise.promise
    .then(path => {
      if (!path) {
        set('pathError', 'error.highway-path');
      } else {
        set('path', path);
        if (segmentsIds.length !== path.length) {
          set('pathError', 'error.highway-path.incomplete');
        }
      }
    })
    .catch(err => {
      if (err instanceof NoiError) {
        set('pathError', err.code);
      } else {
        set('pathError', 'error.highway-path');
      }
    });
  pathDetailsPromise = cancellablePromise(loadPathDetailsEffect(segmentsIds));
  pathDetailsPromise.promise
    .then(data => {
      set('loading', false);
      pathDetailsPromise = undefined;
      if (data === undefined) {
        return;
      }
      set('durationMin', data.timeMin);
      set('syncDate', data.syncDate);
      set('segmentsTime', data.segmentsTime);
    })
    .catch(err => {
      if (err.isCancelled) {
        return;
      }
      pathDetailsPromise = undefined;
      set('loading', false);
      if (err instanceof NoiError) {
        set('errorCode', (err as NoiError).code);
      } else {
        set('errorCode', 'error.highway-time');
      }
    });
}

export const pathState = state;

/**
 * it's like a Redux Effect to load external data in async way
 */
async function loadPathDetailsEffect(segmentsIds: Array<string>): Promise<{syncDate: Date, timeMin: number, segmentsTime: {[id: string]: number}}> {
  const segmentsTime = await NoiAPI.getLinkStationsTime(segmentsIds, true);
  const result = {
    segmentsTime: segmentsTime.reduce((result, i) => { result[i.id] = i.timeSec; return result;}, {} as {[id: string]: number}),
    syncDate: segmentsTime.reduce((result, i) => (i.sync && i.sync < result ? i.sync : result), new Date()),
    timeMin: Math.round(segmentsTime.reduce((result, i) => { result += i.timeSec; return result;}, 0) / 60),
  }
  return result;
}

async function loadPathEffect(segmentsIds: Array<string>): Promise<Array<NoiLinkStation>> {
  const geometryMap = await NoiAPI.getSegmentsGeometries(segmentsIds);
  const path = segmentsIds.reduce((result, id) => {
    if (!geometryMap[id]) {
      return result;
    }
    const ls: NoiLinkStation = {
      type: 'LinkStation',
      id,
      name: geometryMap[id].name,
      origin: 'A22',
      start: null,
      end: null,
      geometry: geometryMap[id].geometry,
      jamLevel: undefined // FIXME:
    }
    result.push(ls);
    return result;
  }, [] as Array<NoiLinkStation>);
  return path;
}
