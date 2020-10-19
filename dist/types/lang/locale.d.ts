export declare enum SupportedLangs {
  it = "it",
  en = "en",
  de = "de"
}
export declare function getNavigatorLang(): SupportedLangs;
export declare function getComponentClosestLang(element: HTMLElement): SupportedLangs;
export declare function fetchLocaleStringsForComponent(componentName: string, locale: string): Promise<any>;
export declare function getLocaleComponentStrings(element: HTMLElement): Promise<any>;
