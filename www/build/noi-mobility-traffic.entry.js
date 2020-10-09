import { r as registerInstance, h, g as getElement } from './index-eae66176.js';
import { l as leafletSrc } from './leaflet-src-ee2a66f1.js';

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

const AUTH_SERVICE_ERR_UNKNOWN = 'error.auth-service.unknown';
const AUTH_SERVICE_ERR_OFFLINE = 'error.auth-service.offline';
class NoiAuthService {
  constructor() {
    this.token = null;
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
  async getValidAccessToken() {
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
    const names = s.sname.split(' - ').map(n => {
      let withoutStart = n.replace('INIZIO ', '');
      return withoutStart.replace('FINE ', '');
    });
    if (names.length !== 2) {
      return result;
    }
    const coordinates = [
      { lat: s.smetadata.latitudineinizio, long: s.smetadata.longitudininizio },
      { lat: s.smetadata.latitudinefine, long: s.smetadata.longitudinefine },
    ];
    if (!result[ids[0]]) {
      result[ids[0]] = {
        id: ids[0],
        name: names[0],
        coordinates: coordinates[0],
        highway: 'A22'
      };
    }
    if (!result[ids[1]]) {
      result[ids[1]] = {
        id: ids[1],
        name: names[1],
        coordinates: coordinates[1],
        highway: 'A22'
      };
    }
    return result;
  }, {});
  return Object.keys(stations).map(i => stations[i]);
}
;
function parse4326Coordinates(value) {
  if (!value || value.srid !== 4326) {
    return null;
  }
  try {
    const result = new leafletSrc.latLng(value.x, value.y);
    return { lat: result.lat, long: result.lng };
  }
  catch (error) {
    return null;
  }
}
function parsVMSDirection(s) {
  if (!s || !s.smetadata || !s.smetadata.direction_id) {
    return 'unknown';
  }
  switch (s.smetadata.direction_id) {
    case '1':
      return 'north';
    case '2':
      return 'south';
    case '3':
      return 'vehicle';
    default:
      return 'unknown';
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
function parseVmsPosition(s) {
  if (s.scode.startsWith('A22:5515')) {
    return 33000;
  }
  if (s.scode.startsWith('A22:5514')) {
    return 119600;
  }
  if (s.scode.startsWith('A22:5514')) {
    return 119600;
  }
  if (s.scode.startsWith('A22:2014')) {
    return 136500;
  }
  if (s.scode.startsWith('A22:2015')) {
    return 136500;
  }
  if (s.scode.startsWith('A22:2018')) {
    return 136500;
  }
  if (s.scode.startsWith('A22:2020')) {
    return 136500;
  }
  return s.smetadata ? +s.smetadata.position_m : 0;
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
  async getLinkStation(id) {
    const response = await this.request(`${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat,edge/LinkStation?where=ecode.eq.${id},eactive.eq.true`);
    if (!response || !response.data || response.data.length !== 1) {
      throw new NoiError(LINK_STATION_ERR_NOT_FOUND, { message: `LinkStation ${id} not found` });
    }
    return parseLinkStation(response.data[0]);
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
    debugger;
    return parseHighwayStations(response.data);
  }
  async getVMSs() {
    const accessToken = await NoiAuth.getValidAccessToken();
    const select = 'sactive,stype,savailable,scoordinate,scode,sname,smetadata';
    const limit = -1;
    const response = await this.request(`${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/flat/VMS/*?select=${select}&limit=${limit}`, { headers: { 'Authorization': `bearer ${accessToken}` } });
    const stations = Object.values(response.data)
      .map((s) => {
      const code = s.scode.split(':');
      const highway = code[0];
      const id = s.scode;
      const coordinates = parse4326Coordinates(s.scoordinate);
      if (!coordinates) {
        return null;
      }
      return {
        id,
        highway,
        name: s.sname.slice(0, -13),
        coordinates,
        type: 'VMS',
        position: parseVmsPosition(s),
        direction: parsVMSDirection(s)
      };
    });
    return stations
      .filter(s => !!s && !(['A22:2014:2', 'A22:2014:1', 'A22:2014:3'].includes(s.id)))
      .sort((a, b) => {
      if (a.position > b.position) {
        return 1;
      }
      if (a.position < b.position) {
        return -1;
      }
      return 0;
    });
  }
  async getTree() {
    const response = await this.request(`${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/tree`);
    if (!Array.isArray(response)) {
      throw new NoiError(NOI_SERVICE_ERR_DATA_FORMAT, { message: 'getTree expecting an array response' });
    }
    return response;
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

var SupportedLangs;
(function (SupportedLangs) {
  SupportedLangs["it"] = "it";
  SupportedLangs["en"] = "en";
  SupportedLangs["de"] = "de";
})(SupportedLangs || (SupportedLangs = {}));
function getNavigatorLang() {
  const lang = navigator.language ? navigator.language.split('-')[0] : 'en';
  return SupportedLangs[lang] ? SupportedLangs[lang] : SupportedLangs.en;
}
function getComponentClosestLang(element) {
  let closestElement = element.closest('[lang]');
  if (closestElement && closestElement.lang && SupportedLangs[closestElement.lang]) {
    return SupportedLangs[closestElement.lang];
  }
  else {
    return getNavigatorLang();
  }
}
function fetchLocaleStringsForComponent(componentName, locale) {
  return new Promise((resolve, reject) => {
    fetch(`/i18n/${componentName}.i18n.${locale}.json`).then(result => {
      if (result.ok)
        resolve(result.json());
      else
        reject();
    }, () => reject());
  });
}
async function getLocaleComponentStrings(element) {
  let componentName = element.tagName.toLowerCase();
  let componentLanguage = getComponentClosestLang(element);
  let strings;
  try {
    strings = await fetchLocaleStringsForComponent(componentName, componentLanguage);
  }
  catch (e) {
    console.warn(`No locale for ${componentName} (${componentLanguage}) loading default locale en.`);
    strings = await fetchLocaleStringsForComponent(componentName, 'en');
  }
  return strings;
}

const noiMobilityTrafficCss = ".sc-noi-mobility-traffic-h{display:block;overflow:hidden;width:var(--noi-width);height:var(--noi-height)}.wrapper.sc-noi-mobility-traffic{position:relative;display:flex;flex-direction:column;height:100%;margin:0}.map.sc-noi-mobility-traffic{z-index:0;flex:1}noi-card.search.sc-noi-mobility-traffic{position:absolute;top:10%;width:100%;margin:0;padding:0;z-index:1;overflow:visible;border-radius:0}@media only screen and (min-width: 600px){noi-card.search.sc-noi-mobility-traffic{overflow:hidden;left:5%;right:5%;width:auto;border-radius:5px}}@media only screen and (min-width: 600px) and (orientation: landscape){noi-card.search.sc-noi-mobility-traffic{width:37%;max-width:500px;bottom:10%}}";

const rIC = (callback) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback);
  }
  else {
    setTimeout(callback, 32);
  }
};
const NoiMobilityTraffic = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.highwayPoints = null;
    this.showSearch = true;
  }
  async componentWillLoad() {
    this.strings = await getLocaleComponentStrings(this.element);
    try {
      this.highwayPoints = await NoiAPI.getHighwayStations();
      debugger;
    }
    catch (error) {
      // TODO:
    }
  }
  async componentDidLoad() {
    rIC(() => {
      import('./tap-click-e7f0b412.js').then(module => module.startTapClick());
    });
  }
  getHighwayCircles(highwayStations) {
    return highwayStations.map((s, i) => {
      return (h("leaflet-circle", { latitude: s.coordinates.lat, longitude: s.coordinates.long, radius: 20, stroke: 1 }, "(", i, ") ", s.id));
    });
  }
  getAllLinkStations(linkStations) {
    return linkStations.map(s => {
      return h("leaflet-geojson", { geometry: JSON.stringify(s.geometry) });
    });
  }
  render() {
    return h("div", { class: "wrapper" }, h("noi-card", { class: "search" }, h("noi-search", null)), h("noi-mobility-map", { class: "map" }, this.highwayPoints ? (this.getHighwayCircles(this.highwayPoints)) : null));
  }
  static get assetsDirs() { return ["assets"]; }
  get element() { return getElement(this); }
};
NoiMobilityTraffic.style = noiMobilityTrafficCss;

export { NoiMobilityTraffic as noi_mobility_traffic };
