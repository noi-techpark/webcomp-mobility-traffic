// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { NoiError } from '@noi/api/error';
import { createStore } from '@stencil/store';
import { CancellablePromise, cancellablePromise } from '@noi/utils';
import { getJamLevel, NoiAPI, NoiLinkStation, StringNumberMap } from '../api';

export interface NoiPathState {
  segments: Array<{id: string, length: number}>;
  readonly path: Array<NoiLinkStation>;
  readonly pathError: string;
  readonly loading: boolean;
  readonly errorCode: string;
  readonly durationMin: number;
  readonly syncDate: Date;
  readonly segmentsTime: StringNumberMap;
  readonly segmentsVelocity: StringNumberMap;
}

const pathStore = createStore<NoiPathState>({
  segments: undefined,
  path: undefined,
  pathError: undefined,
  loading: false,
  errorCode: undefined,
  syncDate: undefined,
  durationMin: undefined,
  segmentsTime: undefined,
  segmentsVelocity: undefined
});

const { onChange, set, state } = pathStore;

let pathDetailsPromise: CancellablePromise<{syncDate: Date, timeMin: number, segmentsTime: StringNumberMap, segmentsVelocity: StringNumberMap}> = undefined;
let pathPromise: CancellablePromise<Array<NoiLinkStation>> = undefined;


onChange('segments', (value) => {
  if (!!value && value.length) {
    loadPath(value);
  }
});

onChange('segmentsVelocity', (value) => {
  if (!!value && !!state.path && state.path.length) {
    // if velocity info was calculated AFTER path => update path jams
    loadJams().then(jams => {
      const pathWithJams =  state.path.map(i => {
        const jamId = i.id.replace('-', '->');
        return {...i, jamLevel: getJamLevel(jams, jamId, value[i.id])};
      });
      set('path', pathWithJams);
    }).catch(_ => {console.error('Error loading traffic jams info')})
  }
});

async function loadJams() {
  try {
    return await NoiAPI.fetchJamThresholds();
  } catch (error) {
    return undefined;
  }
}

function loadPath(segments: Array<{id: string, length: number}>): void {
  set('loading', true);
  set('errorCode', undefined);
  set('durationMin', undefined);
  set('segmentsTime', undefined);
  set('segmentsVelocity', undefined);
  set('syncDate', undefined);
  set('path', undefined);
  set('pathError', undefined);
  
  if (pathDetailsPromise) {
    pathDetailsPromise.cancel()
  }
  if (pathPromise) {
    pathPromise.cancel()
  }
  pathPromise = cancellablePromise(loadPathEffect(segments, state.segmentsVelocity));
  pathPromise.promise
    .then(path => {
      if (!path) {
        set('pathError', 'error.highway-path');
      } else {
        set('path', path);
        if (segments.length !== path.length) {
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
  pathDetailsPromise = cancellablePromise(loadPathDetailsEffect(segments));
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
      set('segmentsVelocity', data.segmentsVelocity);
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
async function loadPathDetailsEffect(segments: Array<{id: string, length: number}>): Promise<{syncDate: Date, timeMin: number, segmentsTime: StringNumberMap, segmentsVelocity: StringNumberMap}> {
  const segmentsIds = segments.map(i => i.id);
  let segmentsTime = await NoiAPI.getLinkStationsTime(segmentsIds, true);
  try {
    const timeThresholds = await NoiAPI.fetchTimeThresholds();
    const segmentsHistoryTime = await NoiAPI.getLinkStationsHistoryTime(segmentsIds, true);
    segmentsTime.forEach(s => {
      let thr = timeThresholds && timeThresholds[s.id.replace('-', '->')];
      if (thr && segmentsHistoryTime[s.id] && (segmentsHistoryTime[s.id].timeSec + thr < s.timeSec)) {
        // historical value + thresholds < actual value
        s.sync = segmentsHistoryTime[s.id].sync;
        s.timeSec = segmentsHistoryTime[s.id].timeSec;
      }
    })
  } catch (error) {
    if (error instanceof NoiError) {
      // TODO: should we do something if either historical data or thresholds config is not available
    } else {
      // TODO: should we do something if either historical data or thresholds config is not available
    }
  }
  const segmentsLengthMap = segments.reduce((result, i) => { result[i.id] = i.length; return result;}, {} as StringNumberMap);
  const result = {
    segmentsVelocity: segmentsTime.reduce((result, i) => { result[i.id] = Math.round((segmentsLengthMap[i.id] / 1000) / (i.timeSec / 3600)); return result;}, {} as StringNumberMap),
    segmentsTime: segmentsTime.reduce((result, i) => { result[i.id] = i.timeSec; return result;}, {} as StringNumberMap),
    syncDate: segmentsTime.reduce((result, i) => (i.sync && i.sync < result ? i.sync : result), new Date()),
    timeMin: Math.round(segmentsTime.reduce((result, i) => { result += i.timeSec; return result;}, 0) / 60),
  }
  return result;
}

async function loadPathEffect(segments: Array<{id: string, length: number}>, velocityMap: StringNumberMap): Promise<Array<NoiLinkStation>> {
  const segmentsIds = segments.map(i => i.id);
  const geometryMap = await NoiAPI.getPathGeometries(segmentsIds);
  const jams = await loadJams();
  const path = segmentsIds.reduce((result, id) => {
    if (!geometryMap[id]) {
      return result;
    }
    const jamLevel = getJamLevel(jams, id, velocityMap ? velocityMap[id] : undefined);
    const ls: NoiLinkStation = {
      type: 'LinkStation',
      id,
      name: geometryMap[id].name,
      origin: 'A22',
      start: null,
      end: null,
      geometry: geometryMap[id].geometry,
      jamLevel
    }
    result.push(ls);
    return result;
  }, [] as Array<NoiLinkStation>);
  return path;
}
