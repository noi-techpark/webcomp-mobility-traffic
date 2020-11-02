import { LatLng } from 'leaflet';
/**
 * getting a valid token should be not concurrent, so if one token request is being processed,
 * another one should wait, in order not to send multiple "login" or "refresh" requests to thew auth server
 */
export const notConcurrent = (proc) => {
  let inFlight = false;
  return () => {
    if (!inFlight) {
      inFlight = (async () => {
        try {
          return await proc();
        }
        finally {
          inFlight = false;
        }
      })();
    }
    return inFlight;
  };
};
export const fnDebounce = (wait, fn) => {
  let timer = undefined;
  return function (...args) {
    if (timer === undefined) {
      fn.apply(this, args);
    }
    clearTimeout(timer);
    timer = window.setTimeout(() => fn.apply(this, args), wait);
    return timer;
  };
};
export function formatDuration(valueMin) {
  const h = Math.floor(valueMin / 60);
  const min = Math.round(valueMin % 60);
  return h ? `${h} h ${min} min` : `${min} min`;
}
export function getAround(points, center, distanceMeters) {
  const c = new LatLng(center.lat, center.long);
  return points.filter(p => {
    return c.distanceTo(new LatLng(p.coordinates.lat, p.coordinates.long)) < distanceMeters;
  });
}
export function getClosestTo(points, center) {
  const c = new LatLng(center.lat, center.long);
  return points.map(point => {
    const distance = c.distanceTo(new LatLng(point.coordinates.lat, point.coordinates.long));
    return { point, distance };
  }).sort((a, b) => {
    return a.distance < b.distance ? 1 : -1;
  })[0].point;
}
export function getDistance(from, center) {
  const c = new LatLng(center.lat, center.long);
  return c.distanceTo(new LatLng(from.coordinates.lat, from.coordinates.long));
}
export function getPointsDistance(from, to) {
  return (new LatLng(from[1], from[0])).distanceTo(new LatLng(to[1], to[0]));
}
export function cancellablePromise(from) {
  let isCancelled = false;
  const promise = new Promise((resolve, reject) => {
    from
      .then(d => isCancelled ? reject({ isCancelled: true }) : resolve(d))
      .catch(e => reject(isCancelled ? { isCancelled: true } : e));
  });
  function cancel() {
    isCancelled = true;
  }
  return { promise, cancel };
}
;
