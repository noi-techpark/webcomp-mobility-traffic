import { NoiError, NOI_ERR_UNKNOWN } from '@noi/api/error';
import { createStore, ObservableMap } from '@stencil/store';
import { CancellablePromise, cancellablePromise } from 'src/utils';
import { NoiAPI, NoiLinkStation } from '../api';

export interface NoiPathState {
  startId: string;
  endId: string;
  path: Array<NoiLinkStation>;
  readonly loading: boolean;
  readonly errorCode: string;
  readonly stations: Array<{position: number, id: string, name: string}>;
  readonly duration: number;
  readonly distance: number;
}

const urbanPathStore = createStore<NoiPathState>({
  startId: undefined,
  endId: undefined,
  loading: false,
  errorCode: undefined,
  path: undefined,
  stations: undefined,
  duration: undefined,
  distance: undefined
});

type PathStationsEffect = (startId: string, endId: string) => Promise<Array<NoiLinkStation>>;

export const urbanPathState = setupPathStore(urbanPathStore, loadUrbanPathEffect);


function setupPathStore(store: ObservableMap<NoiPathState>, effect: PathStationsEffect) {
  const { onChange, set, state } = store;
  let effectPromise: CancellablePromise<Array<NoiLinkStation>> = undefined;

  onChange('path', (path) => {
    if (!path || !path.length) {
      set('stations', undefined);
      return;
    }
    const stations = path.reduce((result, i) => {
      result.push({
        position: result[result.length-1].position + i.distance,
        id: i.end.id,
        name: i.end.name
      });
      return result;
    }, [{position: 0, name: path[0].start.name, id: path[0].start.id}]);
    set('stations', stations);
  });

  onChange('stations', (value) => {
    const distance = value && value.length ? value[value.length-1].position : undefined;
    set('distance', Math.round(distance));
  })

  onChange('startId', (value) => {
    set('path', undefined);
    set('errorCode', undefined);
    if (!!value && state.endId) {
      loadUrbanPath(value, state.endId);
    }
  });

  onChange('endId', (value) => {
    set('path', undefined);
    set('errorCode', undefined);
    if (!!value && state.startId) {
      loadUrbanPath(state.startId, value);
    }
  });


  function loadUrbanPath(startId: string, endId: string): void {
    set('loading', true);
    set('errorCode', undefined);
    if (effectPromise) {
      effectPromise.cancel()
    }
    effectPromise = cancellablePromise(effect(startId, endId));
    effectPromise.promise
      .then(path => {
        set('path', path);
        set('loading', false);
        effectPromise = undefined;
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
  return store.state;
}

/**
 * it's like a Redux Effect to load external data in async way
 */
async function loadUrbanPathEffect(startId: string, endId: string): Promise<Array<NoiLinkStation>> {
  const urbanPath = (await NoiAPI.getUrbanSegmentsIds(startId, endId));
  return urbanPath
    ? await NoiAPI.getLinkStationsByIds(urbanPath, {calcGeometryDistance: true})
    : undefined;
}

