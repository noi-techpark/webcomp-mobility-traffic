import { r as registerInstance, h, g as getElement } from './index-d2a73870.js';
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

const NOI_SERVICE_ERR_UNKNOWN = 'error.noi-service.unknown';
const NOI_SERVICE_ERR_OFFLINE = 'error.noi-service.offline';
const NOI_SERVICE_ERR_DATA_FORMAT = 'error.noi-service.data-format';
function getErrByServiceError(_) {
  return new NoiError(NOI_SERVICE_ERR_OFFLINE);
}
function getErrByStatus(status) {
  if (status === 500) {
    return new NoiError(NOI_SERVICE_ERR_UNKNOWN);
  }
  return new NoiError(NOI_SERVICE_ERR_UNKNOWN);
}
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
class OpenDataHubNoiService {
  async request(url) {
    try {
      const response = await fetch(url);
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
  async getTree() {
    const response = await this.request(`${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/tree`);
    if (!Array.isArray(response)) {
      throw new NoiError(NOI_SERVICE_ERR_DATA_FORMAT, { message: 'getTree expecting an array response' });
    }
    return response;
  }
  async getBluetoothStations() {
    const response = await this.request(`${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/tree/BluetoothStation`);
    if (!response || !response.data || !response.data.BluetoothStation || !response.data.BluetoothStation.stations) {
      throw new NoiError(NOI_SERVICE_ERR_DATA_FORMAT, { message: 'getBluetoothStations expecting an array response in data.BluetoothStation.stations' });
    }
    const stations = Object.values(response.data.BluetoothStation.stations).map((s) => {
      const coordinates = parse4326Coordinates(s.scoordinate);
      if (!coordinates) {
        return null;
      }
      return {
        active: !!s.sactive,
        available: !!s.savailable,
        id: s.scode,
        name: s.sname,
        coordinates,
        type: 'BluetoothStation'
      };
    });
    return stations.filter(s => !!s);
  }
}
OpenDataHubNoiService.BASE_URL = 'https://mobility.api.opendatahub.bz.it';
OpenDataHubNoiService.VERSION = 'v2';
const NoiAPI = new OpenDataHubNoiService();

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

const noiMobilityTrafficCss = ":host{display:block;overflow:hidden;background:var(--noi-mt-background);width:var(--noi-mt-width);height:var(--noi-mt-height)}.wrapper{display:flex;flex-direction:column;height:100%;margin:8px}.map{flex:1}";

const NoiMobilityTraffic = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.stations = null;
  }
  async componentWillLoad() {
    this.strings = await getLocaleComponentStrings(this.element);
  }
  async componentDidLoad() {
    try {
      this.stations = await NoiAPI.getBluetoothStations();
    }
    catch (error) {
      alert(error.code);
    }
    const accessToken = await NoiAuth.getValidAccessToken();
    alert(accessToken);
  }
  getMarkers() {
    return this.stations.map(s => {
      return (h("leaflet-marker", { latitude: s.coordinates.long, longitude: s.coordinates.lat, "icon-url": "https://image.flaticon.com/icons/svg/194/194648.svg", "icon-width": "32", "icon-height": "32" }, s.id));
    });
  }
  render() {
    return h("div", { class: "wrapper" }, h("div", null, this.strings.title, ": ", this.stations ? (this.stations.length) : 0), h("noi-mobility-map", { class: "map" }, this.stations ? (this.getMarkers()) : null));
  }
  get element() { return getElement(this); }
};
NoiMobilityTraffic.style = noiMobilityTrafficCss;

export { NoiMobilityTraffic as noi_mobility_traffic };
