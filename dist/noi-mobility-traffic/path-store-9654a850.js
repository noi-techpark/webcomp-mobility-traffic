import { l as leafletSrc } from './leaflet-src-ee2a66f1.js';
import { c as createStore } from './index-6ba5ef25.js';

const NOI_ERR_UNKNOWN = 'noi.error.unknown';
const NOI_ERR_NO_LOCALE = 'noi.error.no-locale';
class NoiError extends Error {
  constructor(code, options = {}) {
    super(options.message ? options.message : code);
    this.code = code;
    this.options = options;
    // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.name = NoiError.name; // stack traces display correctly now
  }
}

/**
 * getting a valid token should be not concurrent, so if one token request is being processed,
 * another one should wait, in order not to send multiple "login" or "refresh" requests to thew auth server
 */
const notConcurrent = (proc) => {
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
const fnDebounce = (wait, fn) => {
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
function formatDuration(valueMin) {
  const h = Math.floor(valueMin / 60);
  const min = (valueMin % 60);
  return h ? `${h} h ${min} min` : `${min} min`;
}
function getAround(points, center, distanceMeters) {
  const c = new leafletSrc.LatLng(center.lat, center.long);
  return points.filter(p => {
    return c.distanceTo(new leafletSrc.LatLng(p.coordinates.lat, p.coordinates.long)) < distanceMeters;
  });
}
function getClosestTo(points, center) {
  const c = new leafletSrc.LatLng(center.lat, center.long);
  return points.map(point => {
    const distance = c.distanceTo(new leafletSrc.LatLng(point.coordinates.lat, point.coordinates.long));
    return { point, distance };
  }).sort((a, b) => {
    return a.distance < b.distance ? 1 : -1;
  })[0].point;
}
function getDistance(from, center) {
  const c = new leafletSrc.LatLng(center.lat, center.long);
  return c.distanceTo(new leafletSrc.LatLng(from.coordinates.lat, from.coordinates.long));
}
function getPointsDistance(from, to) {
  return (new leafletSrc.LatLng(from[1], from[0])).distanceTo(new leafletSrc.LatLng(to[1], to[0]));
}
function cancellablePromise(from) {
  const isCancelled = { value: false, reason: '' };
  const promise = new Promise((resolve, reject) => {
    from
      .then(d => isCancelled.value ? reject(isCancelled.reason) : resolve(d))
      .catch(e => reject(isCancelled.value ? isCancelled : e));
  });
  function cancel(reason) {
    isCancelled.value = true;
    isCancelled.reason = reason;
  }
  return Object.assign(Object.assign({}, promise), { cancel });
}
;

const AUTH_SERVICE_ERR_UNKNOWN = 'error.auth-service.unknown';
const AUTH_SERVICE_ERR_OFFLINE = 'error.auth-service.offline';
class NoiAuthService {
  constructor() {
    this.token = null;
    this.getValidAccessToken = notConcurrent(async () => {
      if (!NoiAuthService.isAuthTokenExpired(this.token)) {
        return this.token.accessToken;
      }
      if (!NoiAuthService.isRefreshTokenExpired(this.token)) {
        const refreshedToken = await NoiAuthService.refresh(this.token.refreshToken);
        this.token = refreshedToken;
        return refreshedToken.accessToken;
      }
      const newToken = await NoiAuthService.login();
      this.token = newToken;
      return newToken.accessToken;
    });
  }
  static encodeFormData(data) {
    return Object.keys(data)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join('&');
  }
  static parseToken(json) {
    const now = new Date();
    const expiryDate = new Date(now.getTime() + json.expires_in * 1000);
    const refreshExpiryDate = new Date(now.getTime() + json.refresh_expires_in * 1000);
    return {
      accessToken: json.access_token,
      expiryDate,
      refreshToken: json.refresh_token,
      refreshExpiryDate
    };
  }
  getToken() {
    return this.token;
  }
  static isAuthTokenExpired(token) {
    if (!token || !token.accessToken) {
      return true;
    }
    return token.expiryDate >= new Date();
  }
  static isRefreshTokenExpired(token) {
    if (!token || !token.refreshToken) {
      return true;
    }
    return token.refreshExpiryDate >= new Date();
  }
  static async refresh(refreshToken) {
    try {
      const loginData = {
        'grant_type': 'refresh_token',
        'client_id': "it.bz.opendatahub.webcomponents.mobility-traffic",
        'refresh_token': refreshToken
      };
      const response = await fetch("https://auth.opendatahub.bz.it/auth/realms/noi/protocol/openid-connect/token", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: NoiAuthService.encodeFormData(loginData)
      });
      if (!response.ok) {
        throw new NoiError(AUTH_SERVICE_ERR_UNKNOWN);
      }
      const json = await response.json();
      return NoiAuthService.parseToken(json);
    }
    catch (err) {
      if (err instanceof NoiError) {
        throw err;
      }
      throw new NoiError(AUTH_SERVICE_ERR_OFFLINE);
    }
  }
  static async login() {
    try {
      const loginData = {
        'grant_type': 'client_credentials',
        'client_id': "it.bz.opendatahub.webcomponents.mobility-traffic",
        'client_secret': "f476889c-fff0-49a2-b5b5-9cac09f939df"
      };
      const response = await fetch("https://auth.opendatahub.bz.it/auth/realms/noi/protocol/openid-connect/token", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: NoiAuthService.encodeFormData(loginData)
      });
      if (!response.ok) {
        throw new NoiError(AUTH_SERVICE_ERR_UNKNOWN);
      }
      const json = await response.json();
      return NoiAuthService.parseToken(json);
    }
    catch (err) {
      if (err instanceof NoiError) {
        throw err;
      }
      throw new NoiError(AUTH_SERVICE_ERR_OFFLINE);
    }
  }
}
const NoiAuth = new NoiAuthService();

const NOI_SERVICE_ERR_UNKNOWN = 'error.noi-service.unknown';
const NOI_SERVICE_ERR_OFFLINE = 'error.noi-service.offline';
const NOI_SERVICE_ERR_DATA_FORMAT = 'error.noi-service.data-format';
const LINK_STATION_ERR_NOT_FOUND = 'error.link-station.not-found';
const LINK_STATION_PATH_ERR_NOT_FOUND = 'error.link-station-path.not-found';
function getErrByServiceError(_) {
  return new NoiError(NOI_SERVICE_ERR_OFFLINE);
}
function getErrByStatus(status) {
  if (status === 500) {
    return new NoiError(NOI_SERVICE_ERR_UNKNOWN);
  }
  return new NoiError(NOI_SERVICE_ERR_UNKNOWN);
}
;
function parseHighwayStations(linkStations) {
  const stations = linkStations.reduce((result, s) => {
    if (!s ||
      typeof (s.scode) !== 'string' ||
      typeof (s.sname) !== 'string' ||
      !s.smetadata ||
      !s.smetadata.latitudineinizio || !s.smetadata.longitudininizio ||
      !s.smetadata.latitudinefine || !s.smetadata.longitudinefine) {
      return result;
    }
    const ids = s.scode.split('-');
    if (ids.length !== 2) {
      return result;
    }
    const names = s.sname.split(' - ');
    if (names.length !== 2) {
      return result;
    }
    const coordinates = [
      { lat: s.smetadata.latitudineinizio, long: s.smetadata.longitudininizio },
      { lat: s.smetadata.latitudinefine, long: s.smetadata.longitudinefine },
    ];
    const positions = [
      +s.smetadata.metroinizio,
      +s.smetadata.metrofine,
    ];
    if (!result[ids[0]]) {
      result[ids[0]] = {
        id: ids[0],
        name: names[0],
        coordinates: coordinates[0],
        highway: 'A22',
        position: positions[0]
      };
    }
    if (!result[ids[1]]) {
      result[ids[1]] = {
        id: ids[1],
        name: names[1],
        coordinates: coordinates[1],
        highway: 'A22',
        position: positions[1]
      };
    }
    return result;
  }, {});
  return Object.keys(stations)
    .map(i => stations[i])
    .filter(i => {
    // filter out the german ring data
    return !i.id.startsWith('1111');
  });
}
function parse4326Coordinates(value) {
  if (!value || value.srid !== 4326) {
    return null;
  }
  try {
    const long = +value.x * 180 / 20037508.34;
    const lat = Math.atan(Math.exp(+value.y * Math.PI / 20037508.34)) * 360 / Math.PI - 90;
    return { lat, long };
  }
  catch (error) {
    return null;
  }
}
function parseBluetoothStation(prefix, s) {
  if (s[`${prefix}type`] !== 'BluetoothStation') {
    return null;
  }
  if (!s[`${prefix}coordinate`] || !s[`${prefix}coordinate`].y) {
    return null;
  }
  const coordinates = { lat: s[`${prefix}coordinate`].y, long: s[`${prefix}coordinate`].x };
  if (!coordinates) {
    return null;
  }
  return {
    id: s[`${prefix}code`],
    name: s[`${prefix}name`],
    coordinates,
    type: 'BluetoothStation'
  };
}
function calcGeometryDistance(value) {
  if (value.type !== 'LineString') {
    return undefined;
  }
  return value.coordinates.reduce((result, i) => {
    if (result.prev !== null) {
      result.distance += getPointsDistance(result.prev, i);
    }
    result.prev = i;
    return result;
  }, { prev: null, distance: 0 }).distance;
}
function getLinkStationParser(options) {
  return (s) => {
    const start = parseBluetoothStation('sb', s);
    const end = parseBluetoothStation('se', s);
    const result = {
      type: 'LinkStation',
      id: s.ecode,
      name: s.ename,
      origin: s.eorigin,
      geometry: s.egeometry,
      start,
      end
    };
    if (options && options.calcGeometryDistance && s.egeometry) {
      result.distance = calcGeometryDistance(s.egeometry);
    }
    return result;
  };
}
class OpenDataHubNoiService {
  async request(url, init = {}) {
    try {
      const response = await fetch(url, init);
      if (!response.ok) {
        const noiErr = getErrByStatus(response.status);
        throw noiErr;
      }
      const json = await response.json();
      return json;
    }
    catch (err) {
      if (err instanceof NoiError) {
        throw err;
      }
      const noiErr = getErrByServiceError(err);
      throw noiErr;
    }
  }
  async getLinkStationsTime(ids, auth = false) {
    const where = `scode.in.(${ids.join(',')})`;
    const select = `scode,sdatatypes.tempo`;
    const accessToken = auth ? await NoiAuth.getValidAccessToken() : null;
    const headers = accessToken ? { 'Authorization': `bearer ${accessToken}` } : {};
    const response = await this.request(`${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat,node/LinkStation/tempo/latest?limit=-1&select=${select}&where=${where}&distinct=true`, { headers });
    if (!response || !response.data) {
      throw new NoiError(LINK_STATION_ERR_NOT_FOUND, { message: `LinkStation ${name} not found` });
    }
    return response.data.map(s => ({ timeSec: s.mvalue, id: s.scode }));
  }
  async getUrbanSegmentsIds(startId, endId) {
    if (startId === '1854' && endId === '1853') {
      // BZ SÜD -> BZ NORD
      return [
        'Torricelli->siemens',
        'siemens->Galilei_Palermo',
        'Galilei_Palermo->Galilei_Lancia',
        'Galilei_Lancia->Galilei_Virgolo',
        'Galilei_Virgolo->Galleria_Virgolo',
        'Galleria_Virgolo->P_Campiglio'
      ];
    }
    if (startId === '1853' && endId === '1854') {
      // BZ NORD -> BZ SÜD
      return [
        'P_Campiglio->Galleria_Virgolo',
        'Galleria_Virgolo->Arginale_Palermo',
        'Arginale_Palermo->Arginale_Resia',
        'Arginale_Resia->Agip_Einstein'
      ];
    }
    return null;
  }
  async getLinkStationsByIds(ids, options) {
    const where = `egeometry.neq.null,eactive.eq.true,ecode.in.(${ids.join(',')})`;
    const accessToken = options && options.auth ? await NoiAuth.getValidAccessToken() : null;
    const headers = accessToken ? { 'Authorization': `bearer ${accessToken}` } : {};
    const response = await this.request(`${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat,edge/LinkStation?where=${where}&limit=-1`, { headers });
    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new NoiError(NOI_SERVICE_ERR_DATA_FORMAT, { message: `LinkStations expecting an array response` });
    }
    if (response.data.length !== ids.length) {
      throw new NoiError(LINK_STATION_PATH_ERR_NOT_FOUND, { message: `Some of LinkStation ids=${ids.join(',')} are not found` });
    }
    return response.data.map(getLinkStationParser(options));
  }
  async getHighwayStations() {
    const where = 'sorigin.eq.A22,sactive.eq.true';
    const response = await this.request(`${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat/LinkStation?where=${where}&limit=-1`);
    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new NoiError(NOI_SERVICE_ERR_DATA_FORMAT, { message: `HighwayStations expecting an array response` });
    }
    return parseHighwayStations(response.data);
  }
}
OpenDataHubNoiService.BASE_URL = 'https://mobility.api.opendatahub.bz.it';
OpenDataHubNoiService.VERSION = 'v2';
const NoiAPI = new OpenDataHubNoiService();

const urbanPathStore = createStore({
  startId: undefined,
  endId: undefined,
  loading: false,
  errorCode: undefined,
  path: undefined,
  stations: undefined,
  duration: undefined,
  distance: undefined
});
const urbanPathState = setupPathStore(urbanPathStore, loadUrbanPathEffect);
function setupPathStore(store, effect) {
  const { onChange, set, state } = store;
  onChange('path', (path) => {
    if (!path || !path.length) {
      set('stations', undefined);
      return;
    }
    const stations = path.reduce((result, i) => {
      result.push({
        position: result[result.length - 1].position + i.distance,
        id: i.end.id,
        name: i.end.name
      });
      return result;
    }, [{ position: 0, name: path[0].start.name, id: path[0].start.id }]);
    set('stations', stations);
  });
  onChange('stations', (value) => {
    const distance = value && value.length ? value[value.length - 1].position : undefined;
    set('distance', Math.round(distance));
  });
  onChange('startId', (value) => {
    set('path', undefined);
    set('errorCode', undefined);
    if (!!value && state.endId) {
      // FIXME: unsubscribe from hanging promise if it's still loading
      loadUrbanPath(value, state.endId);
    }
  });
  onChange('endId', (value) => {
    set('path', undefined);
    set('errorCode', undefined);
    if (!!value && state.startId) {
      // FIXME: unsubscribe from hanging promise if it's still loading
      loadUrbanPath(state.startId, value);
    }
  });
  function loadUrbanPath(startId, endId) {
    set('loading', true);
    set('errorCode', undefined);
    effect(startId, endId)
      .then(path => {
      set('path', path);
    })
      .catch(err => {
      if (err instanceof NoiError) {
        set('errorCode', err.code);
      }
      else {
        set('errorCode', NOI_ERR_UNKNOWN);
      }
    })
      .finally(() => {
      set('loading', false);
    });
  }
  return store.state;
}
/**
 * it's like a Redux Effect to load external data in async way
 */
async function loadUrbanPathEffect(startId, endId) {
  const urbanPath = (await NoiAPI.getUrbanSegmentsIds(startId, endId));
  return urbanPath
    ? await NoiAPI.getLinkStationsByIds(urbanPath, { calcGeometryDistance: true })
    : undefined;
}

export { NoiAPI as N, NoiError as a, NOI_ERR_NO_LOCALE as b, formatDuration as f, urbanPathState as u };
