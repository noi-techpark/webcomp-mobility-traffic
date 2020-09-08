import { B as BUILD, C as CSS, p as plt, w as win, a as promiseResolve, b as bootstrapLazy } from './index-90a4521b.js';
import { g as globalScripts } from './app-globals-0f993ce5.js';

/*
 Stencil Client Patch Esm v2.0.3 | MIT Licensed | https://stenciljs.com
 */
const patchEsm = () => {
    // NOTE!! This fn cannot use async/await!
    // @ts-ignore
    if (BUILD.cssVarShim && !(CSS && CSS.supports && CSS.supports('color', 'var(--c)'))) {
        // @ts-ignore
        return import(/* webpackChunkName: "polyfills-css-shim" */ './css-shim-f4947359.js').then(() => {
            if ((plt.$cssShim$ = win.__cssshim)) {
                return plt.$cssShim$.i();
            }
            else {
                // for better minification
                return 0;
            }
        });
    }
    return promiseResolve();
};

const defineCustomElements = (win, options) => {
  if (typeof window === 'undefined') return Promise.resolve();
  return patchEsm().then(() => {
  globalScripts();
  return bootstrapLazy([["noi-mobility-map",[[0,"noi-mobility-map",{"tileLayer":[1,"tile-layer"],"iconUrl":[1025,"icon-url"],"iconHeight":[1026,"icon-height"],"iconWidth":[1026,"icon-width"],"latitude":[1026],"longitude":[1026],"scale":[1026],"showScale":[4,"show-scale"],"showDefaultMarker":[4,"show-default-marker"],"defaultPopup":[1025,"default-popup"],"userLatitude":[1026,"user-latitude"],"userLongitude":[1026,"user-longitude"],"userIconUrl":[1025,"user-icon-url"],"userIconWidth":[1026,"user-icon-width"],"userIconHeight":[1026,"user-icon-height"]}]]],["noi-mobility-traffic",[[1,"noi-mobility-traffic"]]]], options);
  });
};

export { defineCustomElements };
