import { LatLng } from 'leaflet';
import { NoiError } from './api/error';

export type Selectable<T> = T & {selected?: boolean};

export type WithStartEnd<T> = T & {isStart?: boolean, isEnd?: boolean};

/**
 * getting a valid token should be not concurrent, so if one token request is being processed,
 * another one should wait, in order not to send multiple "login" or "refresh" requests to thew auth server
 */
export const notConcurrent = <T>(proc: () => PromiseLike<T>) => {
  let inFlight: Promise<T> | false = false;

  return () => {
    if (!inFlight) {
      inFlight = (async () => {
        try {
          return await proc();
        } finally {
          inFlight = false;
        }
      })();
    }
    return inFlight;
  };
};

export const fnDebounce = (wait: number, fn: (...params: any[]) => any) => {
  let timer: number | undefined = undefined;
  return function (this: any, ...args: any[]) {
    if (timer === undefined) {
      fn.apply(this, args);
    }
    clearTimeout(timer);
    timer = window.setTimeout(() => fn.apply(this, args), wait);
    return timer;
  }
};

export function formatDuration(valueMin: number): string {
  const h = Math.floor(valueMin / 60);
  const min = (valueMin % 60);
  return h ? `${h} h ${min} min` : `${min} min`;
}

export interface NoiCoordinate {
  lat: number;
  long: number;
}

export type HasCoordinates<Q extends {coordinates: NoiCoordinate}> = Array<Q>;

export function getAround<T extends {coordinates: NoiCoordinate}>(points: HasCoordinates<T>, center: NoiCoordinate, distanceMeters: number): HasCoordinates<T> {
  const c = new LatLng(center.lat, center.long);
  return points.filter(p => {
    return c.distanceTo(new LatLng(p.coordinates.lat, p.coordinates.long)) < distanceMeters;
  });
}

export function getClosestTo<T extends {coordinates: NoiCoordinate}>(points: HasCoordinates<T>, center: NoiCoordinate) {
  const c = new LatLng(center.lat, center.long);
  return points.map(point=> {
    const distance = c.distanceTo(new LatLng(point.coordinates.lat, point.coordinates.long));
    return {point, distance};
  }).sort((a, b) => {
    return a.distance < b.distance ? 1 : -1;
  })[0].point;
}

export function getDistance<Q extends {coordinates: NoiCoordinate}>(from: Q, center: NoiCoordinate) {
  const c = new LatLng(center.lat, center.long);
  return c.distanceTo(new LatLng(from.coordinates.lat, from.coordinates.long));
}

export function getPointsDistance(from: [number, number], to: [number, number]) {
  return (new LatLng(from[1], from[0])).distanceTo(new LatLng(to[1], to[0]));
}

export type CancellablePromise<T> = {promise: Promise<T>, cancel: () => void};

export function cancellablePromise<T>(from: Promise<T>): CancellablePromise<T> {
  let isCancelled = false;
  const promise = new Promise<T>((resolve, reject) => {
    from
    .then(d => isCancelled ? reject({isCancelled: true}) : resolve(d))
    .catch(e => reject(isCancelled ? {isCancelled: true} : e));
  });
  function cancel() {
    isCancelled = true;
  }
  return {promise, cancel};
};

