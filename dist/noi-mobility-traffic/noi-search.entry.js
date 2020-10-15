import { r as registerInstance, h, e as Host, k as getAssetPath } from './index-375c0366.js';
import { s as state } from './index-52f73d64.js';

const searchCss = ".sc-noi-search-h{display:flex;flex-direction:column;align-items:center}.noi-search__logo.sc-noi-search{margin:16px 0 8px 0;min-height:36px;display:none}.noi-search__footer-text.sc-noi-search{font-family:var(--noi-font-family);font-weight:bold;text-transform:uppercase;text-align:center;color:rgba(var(--noi-primary-rgb), 0.3);font-size:23px;margin-bottom:-16px;margin-top:auto;display:none}.noi-search__footer-img.sc-noi-search{width:100%;margin-top:auto;min-height:200px;display:none}.noi-media-gs.sc-noi-search-h .noi-search__logo.sc-noi-search{display:block}.noi-media-gs.sc-noi-search-h .noi-search__footer-text.sc-noi-search{display:block}.noi-media-gs.sc-noi-search-h .noi-search__footer-img.sc-noi-search{display:block}.noi-media-gs--landscape.sc-noi-search-h .noi-search__footer-img.sc-noi-search{display:block}.noi-search__stations.sc-noi-search{width:100%;display:block;flex:1;margin-bottom:auto}.stations__wrapper.sc-noi-search{display:flex;flex-direction:row;align-items:center}.stations__buttons.sc-noi-search{flex:1}.noi-search__reorder-btn.sc-noi-search{margin-left:auto;margin-right:8px;--transition:box-shadow 200ms cubic-bezier(.4, 0, .2, 1),\n                background-color 15ms linear,\n                color 15ms linear;--box-shadow:none;--padding-start:8px;--padding-end:8px;--background-activated:#eee;--background-activated-opacity:0.5}.noi-search__reorder-btn.noi-activated.sc-noi-search{--background:#eee;--box-shadow:0px 0px 0px 2px #eee}.noi-search__reorder-btn.noi-activated.sc-noi-search>.noi-search__reorder-btn-icon.sc-noi-search{fill:rgba(var(--noi-action-rgb), 0.5)}.noi-search__reorder-btn-icon.sc-noi-search{fill:var(--noi-action)}.noi-search__station-btn.sc-noi-search{text-transform:uppercase;font-size:13px;font-weight:bold;--background:#eee;--color:var(--noi-primary);margin:8px;display:block;margin-right:12px;--transition:box-shadow 200ms cubic-bezier(.4, 0, .2, 1),\n                background-color 15ms linear,\n                color 15ms linear;--box-shadow:none;--padding-top:12px;--padding-right:8px;--padding-bottom:12px;--padding-left:8px;--background-activated:#eee;--background-activated-opacity:0.5}.noi-search__station-btn--empty.sc-noi-search{font-weight:normal;--color:rgba(var(--noi-primary-rgb), 0.5)}";

const Search = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  getStart() {
    // TODO: get placeholder from strings
    return state.start ? state.start.name : 'Partenza?';
  }
  getEnd() {
    // TODO: get placeholder from strings
    return state.end ? state.end.name : 'Destinazione?';
  }
  onInputClick(what) {
    state.selecting = what;
  }
  onReorderClick() {
    const startId = state.startId;
    const endId = state.endId;
    if (startId) {
      state.endId = startId;
    }
    if (endId) {
      state.startId = endId;
    }
  }
  render() {
    const startBtnClass = {
      'noi-search__station-btn--empty': !state.startId,
      'noi-search__station-btn': true
    };
    const endBtnClass = {
      'noi-search__station-btn--empty': !state.endId,
      'noi-search__station-btn': true
    };
    return (h(Host, null, h("img", { class: "noi-search__logo", src: getAssetPath('./assets/logo.svg'), alt: "BrennerLec" }), h("div", { class: "noi-search__stations" }, h("div", { class: "stations__wrapper" }, h("div", { class: "stations__buttons" }, h("noi-button", { class: startBtnClass, onClick: this.onInputClick.bind(this, 'start') }, this.getStart()), h("noi-button", { class: endBtnClass, onClick: this.onInputClick.bind(this, 'end') }, this.getEnd())), h("noi-button", { class: "noi-search__reorder-btn", onClick: this.onReorderClick.bind(this) }, h("svg", { slot: "icon-only", class: "noi-search__reorder-btn-icon", height: "23", viewBox: "0 0 20 23", width: "20", xmlns: "http://www.w3.org/2000/svg" }, h("path", { d: "m16.3379295 9 5.8258823 5.2432941-5.8258823 5.2432942-1.3379295-1.4865883 2.9659059-2.67-15.38399998.000353v-2l15.57799998-.000353-3.1599059-2.8434117zm-10.51204712-9 1.33792947 1.48658829-3.16081185 2.84341171 15.5789059.00035295v2l-15.3849059-.00035295 2.96681185 2.67-1.33792947 1.4865883-5.82588238-5.24329415z", transform: "matrix(0 1 -1 0 20 0)" }))))), h("p", { class: "noi-search__footer-text" }, "Smart travel ", h("br", null), " decisions"), h("img", { class: "noi-search__footer-img", src: getAssetPath('./assets/search.svg'), alt: "" })));
  }
};
Search.style = searchCss;

export { Search as noi_search };
