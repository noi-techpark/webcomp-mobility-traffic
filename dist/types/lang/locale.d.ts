export declare enum SupportedLangs {
  it = "it",
  en = "en",
  de = "de"
}
declare const strings: Map<string, string>;
export declare function getNavigatorLang(): SupportedLangs;
export declare function getComponentClosestLang(element: HTMLElement): SupportedLangs;
export declare function fetchLocaleStringsForComponent(componentName: string, locale: string): Promise<any>;
export declare function getLocaleComponentStrings(element: HTMLElement): Promise<void>;
export default strings;
