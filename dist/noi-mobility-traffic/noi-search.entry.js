import { r as registerInstance, h, e as Host, k as getAssetPath } from './index-375c0366.js';
import { s as state, e as selectCanLoadPath } from './index-e3173a6b.js';

const searchCss = ".sc-noi-search-h{display:flex;flex-direction:column;align-items:center}.search__logo.sc-noi-search{margin:16px 0 8px 0;min-height:36px;display:none}.noi-media-gs.sc-noi-search-h .search__logo.sc-noi-search{display:block}footer.sc-noi-search{display:none;height:0}.noi-media-gs.sc-noi-search-h footer.sc-noi-search{display:block;height:auto}.search-footer__text.sc-noi-search{font-family:var(--noi-font-family);font-weight:bold;text-transform:uppercase;text-align:center;color:rgba(var(--noi-primary-rgb), 0.3);font-size:23px;margin-bottom:-16px}.search-footer__img.sc-noi-search{width:100%;min-height:150px}.search__stations.sc-noi-search{width:100%;display:block;margin-bottom:auto}.search-stations__wrapper.sc-noi-search{display:flex;flex-direction:row;align-items:center}.search-stations__buttons.sc-noi-search{flex:1}.search-reorder-btn.sc-noi-search{margin-left:auto;margin-right:8px;--transition:box-shadow 200ms cubic-bezier(.4, 0, .2, 1),\n                background-color 15ms linear,\n                color 15ms linear;--box-shadow:none;--padding-start:8px;--padding-end:8px;--background-activated:#eee;--background-activated-opacity:0.5}.search-reorder-btn.sc-noi-search>svg.sc-noi-search{fill:var(--noi-action)}.search-reorder-btn.noi-activated.sc-noi-search{--background:#eee;--box-shadow:0px 0px 0px 2px #eee}.search-reorder-btn.noi-activated.sc-noi-search>svg.sc-noi-search{fill:rgba(var(--noi-action-rgb), 0.5)}.search-station-btn.sc-noi-search{text-transform:uppercase;font-size:13px;font-weight:bold;--background:#eee;--color:var(--noi-primary);margin:8px;display:block;margin-right:12px;--transition:box-shadow 200ms cubic-bezier(.4, 0, .2, 1),\n                background-color 15ms linear,\n                color 15ms linear;--box-shadow:none;--padding-top:12px;--padding-right:8px;--padding-bottom:12px;--padding-left:8px;--background-activated:#eee;--background-activated-opacity:0.5;--border-width:1px;--border-style:solid}.search-station-btn--empty.sc-noi-search{font-weight:normal;--color:rgba(var(--noi-primary-rgb), 0.5)}.search-station-btn--start.sc-noi-search{--border-color:rgba(var(--noi-primary-rgb), 0.5)}.search-station-btn--end.sc-noi-search{--border-color:rgba(var(--noi-action-rgb), 0.5)}.search-station-btn--start.sc-noi-search>svg.sc-noi-search{fill:var(--noi-primary)}.search-station-btn--end.sc-noi-search>svg.sc-noi-search{fill:var(--noi-action)}";

const Search = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.durationMin = 0;
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
      'search-station-btn': true,
      'search-station-btn--empty': !state.startId,
      'search-station-btn--start': true
    };
    const endBtnClass = {
      'search-station-btn': true,
      'search-station-btn--empty': !state.endId,
      'search-station-btn--end': true
    };
    return (h(Host, null, h("img", { class: "search__logo", src: getAssetPath('./assets/logo.svg'), alt: "BrennerLec" }), h("div", { class: "search__stations" }, h("div", { class: "search-stations__wrapper" }, h("div", { class: "search-stations__buttons" }, h("noi-button", { class: startBtnClass, onClick: this.onInputClick.bind(this, 'start') }, h("svg", { slot: "start", height: "20", viewBox: "0 0 14 20", width: "14", xmlns: "http://www.w3.org/2000/svg" }, h("path", { d: "m7 0c3.8659932 0 7 3.13400675 7 7 0 2.57732883-2.3333333 6.9106622-7 13l-.60839506-.8015058c-4.26106996-5.6695486-6.39160494-9.73571332-6.39160494-12.1984942 0-3.86599325 3.13400675-7 7-7z", "stroke-width": "2" })), this.getStart()), h("noi-button", { class: endBtnClass, onClick: this.onInputClick.bind(this, 'end') }, h("svg", { slot: "start", height: "20", viewBox: "0 0 14 20", width: "14", xmlns: "http://www.w3.org/2000/svg" }, h("path", { d: "m7 0c3.8659932 0 7 3.13400675 7 7 0 2.57732883-2.3333333 6.9106622-7 13l-.60839506-.8015058c-4.26106996-5.6695486-6.39160494-9.73571332-6.39160494-12.1984942 0-3.86599325 3.13400675-7 7-7z", "stroke-width": "2" })), this.getEnd())), h("noi-button", { class: "search-reorder-btn", onClick: this.onReorderClick.bind(this) }, h("svg", { slot: "icon-only", class: "search-reorder-btn__icon", height: "23", viewBox: "0 0 20 23", width: "20", xmlns: "http://www.w3.org/2000/svg" }, h("path", { d: "m16.3379295 9 5.8258823 5.2432941-5.8258823 5.2432942-1.3379295-1.4865883 2.9659059-2.67-15.38399998.000353v-2l15.57799998-.000353-3.1599059-2.8434117zm-10.51204712-9 1.33792947 1.48658829-3.16081185 2.84341171 15.5789059.00035295v2l-15.3849059-.00035295 2.96681185 2.67-1.33792947 1.4865883-5.82588238-5.24329415z", transform: "matrix(0 1 -1 0 20 0)" }))))), h("footer", null, selectCanLoadPath() ?
      h("img", { class: "search-footer__img", src: getAssetPath('./assets/mountains.svg'), alt: "" })
      : [
        h("p", { class: "search-footer__text" }, "Smart travel ", h("br", null), " decisions"),
        h("img", { class: "search-footer__img", src: getAssetPath('./assets/search.svg'), alt: "" })
      ])));
  }
};
Search.style = searchCss;

export { Search as noi_search };
