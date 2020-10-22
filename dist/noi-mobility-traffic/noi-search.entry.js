import { r as registerInstance, h, k as getAssetPath, e as Host } from './index-375c0366.js';
import './index-6ba5ef25.js';
import { s as state, c as selectCanLoadPath } from './index-606d4fed.js';

const searchCss = ".sc-noi-search-h{--height:210px;position:absolute;background:#fff;width:100%;top:0;bottom:0;left:0;margin:0;padding:0;z-index:1;overflow:hidden;transform:translateY(calc(100% - var(--height)));-webkit-transform:translateY(calc(100% - var(--height)));will-change:transform}.sc-noi-search-h:not(.noi-media-gs).slide-in{animation:search-slide-in 0.5s forwards;-webkit-animation:search-slide-in 0.5s forwards}.sc-noi-search-h:not(.noi-media-gs).slide-out{animation:search-slide-out 0.5s forwards;-webkit-animation:search-slide-out 0.5s forwards}.noi-media-gs.sc-noi-search-h{height:auto;height:100%;max-width:360px;transform:translateY(0);-webkit-transform:translateY(0)}.noi-media-gs--landscape.sc-noi-search-h{height:100%;width:360px}@keyframes search-slide-in{100%{transform:translateY(0);-webkit-transform:translateY(0)}}@-webkit-keyframes search-slide-in{100%{transform:translateY(0);-webkit-transform:translateY(0)}}@keyframes search-slide-out{0%{transform:translateY(0)}100%{transform:translateY(calc(100% - var(--height)))}}@-webkit-keyframes search-slide-out{0%{-webkit-transform:translateY(0%)}100%{-webkit-transform:translateY(calc(100% - var(--height)))}}header.sc-noi-search{display:flex;margin:16px 0 8px 0;min-height:36px}.header__back-btn.sc-noi-search{margin-right:auto;min-width:48px;fill:var(--noi-primary)}.noi-media-gs.sc-noi-search-h .header__back-btn.sc-noi-search{visibility:hidden}.sc-noi-search-h:not(.slide-in) .header__back-btn.sc-noi-search{visibility:hidden}.content.sc-noi-search{display:flex;flex-direction:column;height:100%}.search__logo.sc-noi-search{flex:1;margin-right:16px}footer.sc-noi-search{display:none;height:0;z-index:999}.slide-in.sc-noi-search-h footer.sc-noi-search{display:block;height:auto}.noi-media-gs.sc-noi-search-h footer.sc-noi-search{display:block;height:auto}.search-footer__text.sc-noi-search{font-family:var(--noi-font-family);font-weight:bold;text-transform:uppercase;text-align:center;color:rgba(var(--noi-primary-rgb), 0.3);font-size:23px;margin-bottom:-16px}.search-footer__img.sc-noi-search{width:100%;min-height:150px}.search__stations.sc-noi-search{width:100%;display:block;margin-bottom:auto}.search-stations__wrapper.sc-noi-search{display:flex;flex-direction:row;align-items:center}.search-stations__buttons.sc-noi-search{flex:1}.search-reorder-btn.sc-noi-search{margin-left:auto;margin-right:8px;--transition:box-shadow 200ms cubic-bezier(.4, 0, .2, 1),\n                background-color 15ms linear,\n                color 15ms linear;--box-shadow:none;--padding-start:8px;--padding-end:8px;--background-activated:#eee;--background-activated-opacity:0.5}.search-reorder-btn.sc-noi-search>svg.sc-noi-search{fill:var(--noi-action)}.search-reorder-btn.noi-activated.sc-noi-search{--background:#eee;--box-shadow:0px 0px 0px 2px #eee}.search-reorder-btn.noi-activated.sc-noi-search>svg.sc-noi-search{fill:rgba(var(--noi-action-rgb), 0.5)}.search-station-btn.sc-noi-search{text-transform:uppercase;font-size:13px;font-weight:bold;--background:#eee;--color:var(--noi-primary);margin:8px;display:block;margin-right:12px;--transition:box-shadow 200ms cubic-bezier(.4, 0, .2, 1),\n                background-color 15ms linear,\n                color 15ms linear;--box-shadow:none;--padding-top:12px;--padding-right:8px;--padding-bottom:12px;--padding-left:8px;--background-activated:#eee;--background-activated-opacity:0.5;--border-width:1px;--border-style:solid}.search-station-btn--empty.sc-noi-search{font-weight:normal;--color:rgba(var(--noi-primary-rgb), 0.5)}.search-station-btn--start.sc-noi-search{--border-color:rgba(var(--noi-primary-rgb), 0.5)}.search-station-btn--end.sc-noi-search{--border-color:rgba(var(--noi-action-rgb), 0.5)}.search-station-btn--start.sc-noi-search>svg.sc-noi-search{fill:var(--noi-primary)}.search-station-btn--end.sc-noi-search>svg.sc-noi-search{fill:var(--noi-action)}noi-path-details.sc-noi-search{flex:1;overflow:hidden;width:100%;margin-bottom:-48px}";

const Search = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.durationMin = 0;
    this.hostClass = {};
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
  onToggleActive(event) {
    if (!this.hostClass.slideIn) {
      state.activePath = event.detail;
      this.hostClass = { slideIn: true };
      return;
    }
    const toggle = state.activePath === event.detail;
    state.activePath = event.detail;
    if (toggle && this.hostClass.slideIn) {
      this.hostClass = { slideOut: true };
    }
  }
  onSlideOut() {
    this.hostClass = { slideOut: true };
  }
  renderDetails() {
    if (!selectCanLoadPath()) {
      return null;
    }
    return (h("noi-path-details", { startId: state.startId, endId: state.endId, onToggleActive: this.onToggleActive.bind(this) }));
  }
  renderFooter() {
    if (selectCanLoadPath()) {
      return (h("img", { class: "search-footer__img", src: getAssetPath('./assets/mountains.svg'), alt: "" }));
    }
    return [
      h("p", { class: "search-footer__text" }, "Smart travel ", h("br", null), " decisions"),
      h("img", { class: "search-footer__img", src: getAssetPath('./assets/search.svg'), alt: "" })
    ];
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
    const hostClass = {
      'slide-in': this.hostClass.slideIn,
      'slide-out': this.hostClass.slideOut
    };
    return (h(Host, { class: hostClass }, h("div", { class: "content" }, h("header", null, h("noi-button", { class: "header__back-btn", fill: "clear", onClick: this.onSlideOut.bind(this) }, h("svg", { slot: "icon-only", class: "header__icon", height: "14", viewBox: "0 0 10 14", width: "10", xmlns: "http://www.w3.org/2000/svg" }, h("path", { d: "m0 1.53073535 1.28718658-1.53073535 8.35973178 7.02965056-8.35973178 7.02965054-1.28718658-1.5307353 6.53859329-5.49919813z", transform: "matrix(-1 0 0 1 9.646918 0)" }))), h("img", { class: "search__logo", src: getAssetPath('./assets/logo.svg'), alt: "BrennerLec" })), h("div", { class: "search__stations" }, h("div", { class: "search-stations__wrapper" }, h("div", { class: "search-stations__buttons" }, h("noi-button", { class: startBtnClass, onClick: this.onInputClick.bind(this, 'start') }, h("svg", { slot: "start", height: "20", viewBox: "0 0 14 20", width: "14", xmlns: "http://www.w3.org/2000/svg" }, h("path", { d: "m7 0c3.8659932 0 7 3.13400675 7 7 0 2.57732883-2.3333333 6.9106622-7 13l-.60839506-.8015058c-4.26106996-5.6695486-6.39160494-9.73571332-6.39160494-12.1984942 0-3.86599325 3.13400675-7 7-7z", "stroke-width": "2" })), this.getStart()), h("noi-button", { class: endBtnClass, onClick: this.onInputClick.bind(this, 'end') }, h("svg", { slot: "start", height: "20", viewBox: "0 0 14 20", width: "14", xmlns: "http://www.w3.org/2000/svg" }, h("path", { d: "m7 0c3.8659932 0 7 3.13400675 7 7 0 2.57732883-2.3333333 6.9106622-7 13l-.60839506-.8015058c-4.26106996-5.6695486-6.39160494-9.73571332-6.39160494-12.1984942 0-3.86599325 3.13400675-7 7-7z", "stroke-width": "2" })), this.getEnd())), h("noi-button", { class: "search-reorder-btn", onClick: this.onReorderClick.bind(this) }, h("svg", { slot: "icon-only", class: "search-reorder-btn__icon", height: "23", viewBox: "0 0 20 23", width: "20", xmlns: "http://www.w3.org/2000/svg" }, h("path", { d: "m16.3379295 9 5.8258823 5.2432941-5.8258823 5.2432942-1.3379295-1.4865883 2.9659059-2.67-15.38399998.000353v-2l15.57799998-.000353-3.1599059-2.8434117zm-10.51204712-9 1.33792947 1.48658829-3.16081185 2.84341171 15.5789059.00035295v2l-15.3849059-.00035295 2.96681185 2.67-1.33792947 1.4865883-5.82588238-5.24329415z", transform: "matrix(0 1 -1 0 20 0)" }))))), this.renderDetails(), h("footer", null, this.renderFooter()))));
  }
};
Search.style = searchCss;

export { Search as noi_search };
