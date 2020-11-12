import { NoiError, NOI_ERR_UNKNOWN } from '@noi/api/error';
import { createStore } from '@stencil/store';
import { CancellablePromise, cancellablePromise } from '@noi/utils';
import { NoiAPI, NoiJams, NoiLinkStation } from '../api';

export interface NoiPathState {
  segmentsIds: Array<string>;
  readonly path: Array<NoiLinkStation>;
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
  jams: undefined,
  loading: false,
  errorCode: undefined,
  syncDate: undefined,
  durationMin: undefined,
  segmentsTime: undefined
});

const { onChange, set, state } = pathStore;

let effectPromise: CancellablePromise<{syncDate: Date, timeMin: number, segmentsTime: {[id: string]: number}}> = undefined;

loadJams();


onChange('segmentsIds', (value) => {
  if (!!value && value.length) {
    loadPathDetails(value);
  }
});

function loadJams() {
  NoiAPI.fetchJamThresholds()
    .then(jams => {
      set('jams', jams);
    })
    .catch(_ => {});
}

function loadPathDetails(segmentsIds: Array<string>): void {
  set('loading', true);
  set('errorCode', undefined);
  set('durationMin', undefined);
  set('segmentsTime', undefined);
  set('syncDate', undefined);
  
  if (effectPromise) {
    effectPromise.cancel()
  }
  effectPromise = cancellablePromise(loadPathEffect(segmentsIds));
  effectPromise.promise
    .then(data => {
      set('loading', false);
      effectPromise = undefined;
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
      effectPromise = undefined;
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
async function loadPathEffect(segmentsIds: Array<string>): Promise<{syncDate: Date, timeMin: number, segmentsTime: {[id: string]: number}}> {
  const segmentsTime = await NoiAPI.getLinkStationsTime(segmentsIds, true);
  const result = {
    segmentsTime: segmentsTime.reduce((result, i) => { result[i.id] = i.timeSec; return result;}, {} as {[id: string]: number}),
    syncDate: segmentsTime.reduce((result, i) => (i.sync && i.sync < result ? i.sync : result), new Date()),
    timeMin: Math.round(segmentsTime.reduce((result, i) => { result += i.timeSec; return result;}, 0) / 60),
  }
  return result;
}
