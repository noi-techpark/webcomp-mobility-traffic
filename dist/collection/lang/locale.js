import { NoiError, NOI_ERR_NO_LOCALE } from '@noi/api/error';
export var SupportedLangs;
(function (SupportedLangs) {
  SupportedLangs["it"] = "it";
  SupportedLangs["en"] = "en";
  SupportedLangs["de"] = "de";
})(SupportedLangs || (SupportedLangs = {}));
const strings = new Map();
let locale = undefined;
export function getNavigatorLang() {
  const lang = navigator.language ? navigator.language.split('-')[0] : 'en';
  return SupportedLangs[lang] ? SupportedLangs[lang] : SupportedLangs.en;
}
export function getComponentClosestLang(element) {
  let closestElement = element.closest('[lang]');
  if (closestElement && closestElement.lang && SupportedLangs[closestElement.lang]) {
    return SupportedLangs[closestElement.lang];
  }
  else {
    return getNavigatorLang();
  }
}
export function fetchLocaleStringsForComponent(componentName, locale) {
  return new Promise((resolve, reject) => {
    fetch(`/i18n/${componentName}.i18n.${locale}.json`).then(result => {
      if (result.ok)
        resolve(result.json());
      else
        reject();
    }, () => reject());
  });
}
export async function getLocaleComponentStrings(element) {
  let componentName = element.tagName.toLowerCase();
  let componentLanguage = getComponentClosestLang(element);
  try {
    locale = await fetchLocaleStringsForComponent(componentName, componentLanguage);
  }
  catch (e) {
    console.warn(`No locale for ${componentName} (${componentLanguage}) loading default locale en.`);
  }
  try {
    locale = locale || await fetchLocaleStringsForComponent(componentName, 'en');
    Object.keys(locale).forEach(key => strings.set(key, locale[key]));
  }
  catch (error) {
    throw new NoiError(NOI_ERR_NO_LOCALE, { message: 'Unable to fetch any language' });
  }
}
export function translate(code) {
  if (strings.has(code)) {
    return strings.get(code);
  }
  return code;
}
