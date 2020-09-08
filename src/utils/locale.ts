export enum SupportedLangs {
  it = 'it',
  en = 'en',
  de = 'de',
}

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

export function fetchLocaleStringsForComponent(componentName: string, locale: string): Promise<any> {
  return new Promise((resolve, reject): void => {
    fetch(`/i18n/${componentName}.i18n.${locale}.json`).then(
      result => {
        if (result.ok) resolve(result.json());
        else reject();
      },
      () => reject()
    );
  });
}

export async function getLocaleComponentStrings(element: HTMLElement): Promise<any> {
  let componentName = element.tagName.toLowerCase();
  let componentLanguage = getComponentClosestLang(element);
  let strings;
  try {
    strings = await fetchLocaleStringsForComponent(componentName, componentLanguage);
  } catch (e) {
    console.warn(`No locale for ${componentName} (${componentLanguage}) loading default locale en.`);
    strings = await fetchLocaleStringsForComponent(componentName, 'en');
  }
  return strings;
}
