import { r as registerInstance, h, g as getElement } from './index-e280071f.js';

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
    this.linkStations = null;
    this.showSearch = true;
  }
  async componentWillLoad() {
    this.strings = await getLocaleComponentStrings(this.element);
  }
  async componentDidLoad() {
    rIC(() => {
      import('./tap-click-ea539ae7.js').then(module => module.startTapClick());
    });
  }
  getHighwayCircles(highwayStations) {
    return highwayStations.map((s, i) => {
      return (h("leaflet-circle", { latitude: s.coordinates.long, longitude: s.coordinates.lat, radius: 20, stroke: 1 }, "(", i, ") ", s.id, " - ", s.position));
    });
  }
  getAllLinkStations(linkStations) {
    return linkStations.map(s => {
      return h("leaflet-geojson", { geometry: JSON.stringify(s.geometry) });
    });
  }
  render() {
    return h("div", { class: "wrapper" }, h("noi-card", { class: "search" }, h("noi-search", null)), h("noi-mobility-map", { class: "map" }, this.linkStations ? (this.getAllLinkStations(this.linkStations)) : null));
  }
  get element() { return getElement(this); }
};
NoiMobilityTraffic.style = noiMobilityTrafficCss;

export { NoiMobilityTraffic as noi_mobility_traffic };
