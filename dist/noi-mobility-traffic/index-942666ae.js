const NOI_ERR_UNKNOWN = 'noi.error.unknown';
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
    const long = value.x * 180 / 20037508.34;
    const lat = Math.atan(Math.exp(value.y * Math.PI / 20037508.34)) * 360 / Math.PI - 90;
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
  const coordinates = parse4326Coordinates(s[`${prefix}coordinate`]);
  if (!coordinates) {
    return null;
  }
  return {
    active: !!s[`${prefix}active`],
    available: !!s[`${prefix}available`],
    id: s[`${prefix}code`],
    name: s[`${prefix}name`],
    coordinates,
    type: 'BluetoothStation'
  };
}
function parseLinkStation(s) {
  const start = parseBluetoothStation('sb', s);
  const end = parseBluetoothStation('se', s);
  return {
    type: 'LinkStation',
    active: !!s.eactive,
    available: !!s.eavailable,
    id: s.ecode,
    name: s.ename,
    origin: s.eorigin,
    geometry: s.egeometry,
    start,
    end
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
  async getLinkStationAvgTime(id, auth = false) {
    const where = `scode.eq.${id}`;
    const select = `sdatatypes.tempo`;
    const accessToken = auth ? await NoiAuth.getValidAccessToken() : null;
    const headers = accessToken ? { 'Authorization': `bearer ${accessToken}` } : {};
    const response = await this.request(`${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat,node/LinkStation/tempo/latest?limit=-1&select=${select}&where=${where}&distinct=true`, { headers });
    if (!response || !response.data) {
      throw new NoiError(LINK_STATION_ERR_NOT_FOUND, { message: `LinkStation ${name} not found` });
    }
    return response.data.reduce((result, t) => { result += t.mvalue; return result; }, 0);
  }
  async getSegmentsAvgTime(ids, auth = false) {
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
  async getLinkStations() {
    const where = 'egeometry.neq.null,eactive.eq.true';
    const accessToken = await NoiAuth.getValidAccessToken();
    const response = await this.request(`${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat,edge/LinkStation?where=${where}&limit=-1`, { headers: { 'Authorization': `bearer ${accessToken}` } });
    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new NoiError(NOI_SERVICE_ERR_DATA_FORMAT, { message: `LinkStations expecting an array response` });
    }
    return response.data.map(parseLinkStation);
  }
  async getHighwayStations() {
    const where = 'sorigin.eq.A22,sactive.eq.true';
    const response = await this.request(`${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat/LinkStation?where=${where}&limit=-1`);
    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new NoiError(NOI_SERVICE_ERR_DATA_FORMAT, { message: `HighwayStations expecting an array response` });
    }
    return parseHighwayStations(response.data);
  }
  async getRoute(startId, endId) {
    const accessToken = await NoiAuth.getValidAccessToken();
    const where = `scode.eq.${startId},sactive.eq.true`;
    const response = await this.request(`${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat/LinkStation?where=${where}&limit=-1`, { headers: { 'Authorization': `bearer ${accessToken}` } });
    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new NoiError(NOI_SERVICE_ERR_DATA_FORMAT, { message: `HighwayStations expecting an array response` });
    }
    return parseHighwayStations(response.data);
  }
  async getBluetoothStations() {
    const response = await this.request(`${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/
      tree/BluetoothStation`);
    if (!response || !response.data || !response.data.BluetoothStation || !response.data.BluetoothStation.stations) {
      throw new NoiError(NOI_SERVICE_ERR_DATA_FORMAT, {
        message: 'getBluetoothStations expecting an array response in data.BluetoothStation.stations'
      });
    }
    return Object
      .values(response.data.BluetoothStation.stations)
      .map(s => parseBluetoothStation('s', s))
      .filter(s => !!s);
  }
}
OpenDataHubNoiService.BASE_URL = 'https://mobility.api.opendatahub.bz.it';
OpenDataHubNoiService.VERSION = 'v2';
const NoiAPI = new OpenDataHubNoiService();

export { NoiAPI as N };
