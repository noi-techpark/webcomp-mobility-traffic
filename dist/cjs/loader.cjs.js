'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-47f157e1.js');
const appGlobals = require('./app-globals-3a1e7e63.js');

/*
 Stencil Client Patch Esm v2.0.3 | MIT Licensed | https://stenciljs.com
 */
const patchEsm = () => {
    // NOTE!! This fn cannot use async/await!
    // @ts-ignore
    if (index.BUILD.cssVarShim && !(index.CSS && index.CSS.supports && index.CSS.supports('color', 'var(--c)'))) {
        // @ts-ignore
        return Promise.resolve().then(function () { return require(/* webpackChunkName: "polyfills-css-shim" */ './css-shim-a1739d5c.js'); }).then(() => {
            if ((index.plt.$cssShim$ = index.win.__cssshim)) {
                return index.plt.$cssShim$.i();
            }
            else {
                // for better minification
                return 0;
            }
        });
    }
    return index.promiseResolve();
};

const defineCustomElements = (win, options) => {
  if (typeof window === 'undefined') return Promise.resolve();
  return patchEsm().then(() => {
  appGlobals.globalScripts();
  return index.bootstrapLazy([["noi-mobility-map.cjs",[[0,"noi-mobility-map",{"tileLayer":[1,"tile-layer"],"iconUrl":[1025,"icon-url"],"iconHeight":[1026,"icon-height"],"iconWidth":[1026,"icon-width"],"latitude":[1026],"longitude":[1026],"scale":[1026],"showScale":[4,"show-scale"],"showDefaultMarker":[4,"show-default-marker"],"defaultPopup":[1025,"default-popup"],"userLatitude":[1026,"user-latitude"],"userLongitude":[1026,"user-longitude"],"userIconUrl":[1025,"user-icon-url"],"userIconWidth":[1026,"user-icon-width"],"userIconHeight":[1026,"user-icon-height"]}]]],["noi-mobility-traffic.cjs",[[1,"noi-mobility-traffic"]]]], options);
  });
};

exports.defineCustomElements = defineCustomElements;
