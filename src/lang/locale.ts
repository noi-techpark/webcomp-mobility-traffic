// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { NoiError, NOI_ERR_NO_LOCALE } from '@noi/api/error';
import { getAssetPath } from '@stencil/core';

export enum SupportedLangs {
  it = 'it',
  en = 'en',
  de = 'de',
}

const strings = new Map<string, string>();
let locale = undefined;

export function getNavigatorLang(): SupportedLangs {
  const lang = navigator.language ? navigator.language.split('-')[0] : 'en';
  return SupportedLangs[lang] ? SupportedLangs[lang] : SupportedLangs.en;
}


export function getComponentClosestLang(element: HTMLElement): SupportedLangs {
  let closestElement = element.closest('[lang]') as HTMLElement;
  if (closestElement && closestElement.lang && SupportedLangs[closestElement.lang]) {
    return SupportedLangs[closestElement.lang];
  } else {
    return getNavigatorLang();
  }
}

export async function fetchLocaleStringsForComponent(componentName: string, locale: string): Promise<any> {
  try {
    const result = await fetch(getAssetPath(`./${componentName}.i18n.${locale}.json`));
    if (result.ok) {
      return result.json();
    }
    return null;
  } catch (error) {
    console.warn(`No locale for ${componentName} (${locale}) loading default locale en.`);
    return null;
  }
}

export async function getLocaleComponentStrings(element: HTMLElement): Promise<void> {
  let componentName = element.tagName.toLowerCase();
  let componentLanguage = getComponentClosestLang(element);
  locale = await fetchLocaleStringsForComponent(componentName, componentLanguage);
  locale = locale || await fetchLocaleStringsForComponent(componentName, 'en');
  if (locale) {
    Object.keys(locale).forEach(key => strings.set(key, locale[key]));
  } else {
    throw new NoiError(NOI_ERR_NO_LOCALE, {message: 'Unable to fetch any language'});
  }
}

export function translate(code: string) {
  if (strings.has(code)) {
    return strings.get(code);
  }
  return code;
}



