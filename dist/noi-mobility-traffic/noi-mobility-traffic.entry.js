import { r as registerInstance, l as h, n as getElement } from './index-683b5499.js';

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

const noiMobilityTrafficCss = ".sc-noi-mobility-traffic-h{display:block;overflow:hidden;background:var(--noi-mt-background);width:var(--noi-mt-width);height:var(--noi-mt-height)}.wrapper.sc-noi-mobility-traffic{display:flex;flex-direction:column;height:100%;margin:8px}.map.sc-noi-mobility-traffic{flex:1}leaflet-circle.sc-noi-mobility-traffic,leaflet-marker.sc-noi-mobility-traffic,leaflet-polyline.sc-noi-mobility-traffic{display:none}";

const NoiMobilityTraffic = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.btStations = null;
    this.highwayStations = null;
    this.highwayLine = null;
    this.linkStation = null;
    this.linkStations = null;
  }
  async componentWillLoad() {
    this.strings = await getLocaleComponentStrings(this.element);
  }
  async componentDidLoad() {
    try {
      // this.btStations = await NoiAPI.getBluetoothStations();
    }
    catch (error) {
      alert(error.code);
    }
    try {
      // this.highwayStations = await NoiAPI.getHighwayStations();
      // this.linkStation = await NoiAPI.getLinkStation('A22_ML103->A22_ML107');
      // this.linkStation = await NoiAPI.getLinkStation('Agip_Einstein->meinstein');
      // this.linkStations = await NoiAPI.getLinkStations();
      // debugger;
      // this.highwayLine = this.highwayStations.reduce((result, i) => {
      //   if (i.direction === 'unknown' || i.direction === 'vehicle') {
      //     return result;
      //   }
      //   const p = [i.coordinates.long, i.coordinates.lat];
      //   if (result.coordinates !== JSON.stringify(i.coordinates)) {
      //     result.data.push(p);
      //     result.coordinates = JSON.stringify(i.coordinates);
      //   }
      //   return result;
      // }, {data: [], coordinates: ''}).data;
    }
    catch (error) {
      alert(error.code);
    }
  }
  getBtMarkers() {
    const icon = 'https://image.flaticon.com/icons/svg/194/194648.svg';
    return this.btStations.map(s => {
      return (h("leaflet-marker", { latitude: s.coordinates.long, longitude: s.coordinates.lat, "icon-url": icon, "icon-width": "32", "icon-height": "32" }, s.id));
    });
  }
  getHighwayCircles() {
    return this.highwayStations.map((s, i) => {
      return (h("leaflet-circle", { latitude: s.coordinates.long, longitude: s.coordinates.lat, radius: 20, stroke: 1 }, "(", i, ") ", s.id, " - ", s.position));
    });
  }
  getAllLinkStations() {
    return this.linkStations.map(s => {
      return h("leaflet-geojson", { geometry: JSON.stringify(s.geometry) });
    });
  }
  render() {
    return h("div", { class: "wrapper" }, h("div", null, this.strings.title, ": ", this.btStations ? (this.btStations.length) : 0), h("div", null, h("ion-button", { color: "primary" }, "Click me!")), h("noi-mobility-map", { class: "map" }, this.btStations ? (this.getBtMarkers()) : null, this.highwayStations ? (this.getHighwayCircles()) : null, this.highwayLine ? (h("leaflet-polyline", { path: JSON.stringify(this.highwayLine) })) : null, this.linkStation ? (h("leaflet-geojson", { geometry: JSON.stringify(this.linkStation.geometry) })) : null, this.linkStations ? (this.getAllLinkStations()) : null));
  }
  get element() { return getElement(this); }
};
NoiMobilityTraffic.style = noiMobilityTrafficCss;

export { NoiMobilityTraffic as noi_mobility_traffic };
