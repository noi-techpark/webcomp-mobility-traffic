import { r as registerInstance, h, g as getElement } from './index-90a4521b.js';

var SupportedLangs;
(function (SupportedLangs) {
  SupportedLangs["it"] = "it";
  SupportedLangs["en"] = "en";
  SupportedLangs["de"] = "de";
})(SupportedLangs || (SupportedLangs = {}));
function getNavigatorLang() {
  const lang = navigator.language.split('-')[0];
  return SupportedLangs[lang] ? SupportedLangs[lang] : SupportedLangs.en;
}
function getComponentClosestLang(element) {
  let closestElement = element.closest('[lang]');
  if (closestElement && closestElement.lang && SupportedLangs[closestElement.lang]) {
    return SupportedLangs[element.lang];
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
  }
  async componentWillLoad() {
    this.strings = await getLocaleComponentStrings(this.element);
  }
  render() {
    return h("div", { class: "wrapper" }, h("div", null, this.strings.title), h("noi-mobility-map", { class: "map" }));
  }
  get element() { return getElement(this); }
};
NoiMobilityTraffic.style = noiMobilityTrafficCss;

export { NoiMobilityTraffic as noi_mobility_traffic };
