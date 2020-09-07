import { p as promiseResolve, b as bootstrapLazy } from './index-4aee7b97.js';

/*
 Stencil Client Patch Browser v2.0.3 | MIT Licensed | https://stenciljs.com
 */
const patchBrowser = () => {
    const importMeta = import.meta.url;
    const opts =  {};
    if ( importMeta !== '') {
        opts.resourcesUrl = new URL('.', importMeta).href;
    }
    return promiseResolve(opts);
};

patchBrowser().then(options => {
  return bootstrapLazy([["noi-mobility-traffic",[[1,"noi-mobility-traffic",{"first":[1],"middle":[1],"last":[1]}]]]], options);
});
