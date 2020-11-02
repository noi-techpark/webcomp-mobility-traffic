import { Host, Component, h, getAssetPath, State } from '@stencil/core';
import noiStore, { selectCanLoadPath } from '@noi/store';
import { translate } from '@noi/lang';
export class Search {
  constructor() {
    this.durationMin = 0;
    this.hostClass = {};
  }
  getStart() {
    return noiStore.start ? noiStore.start.name : translate('search.start-placeholder');
  }
  getEnd() {
    return noiStore.end ? noiStore.end.name : translate('search.end-placeholder');
  }
  onInputClick(what) {
    noiStore.selecting = what;
  }
  onReorderClick() {
    const startId = noiStore.startId;
    const endId = noiStore.endId;
    if (startId) {
      noiStore.endId = startId;
    }
    if (endId) {
      noiStore.startId = endId;
    }
  }
  onToggleActive(event) {
    if (!this.hostClass.slideIn) {
      noiStore.activePath = event.detail;
      this.hostClass = { slideIn: true };
      return;
    }
    const toggle = noiStore.activePath === event.detail;
    noiStore.activePath = event.detail;
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
    return (h("noi-path-details", { startId: noiStore.startId, endId: noiStore.endId, onToggleActive: this.onToggleActive.bind(this) }));
  }
  renderFooter() {
    if (selectCanLoadPath()) {
      return (h("img", { class: "search-footer__img", src: getAssetPath('./assets/mountains.svg'), alt: "" }));
    }
    return [
      h("p", { class: "search-footer__text" },
        "Smart travel ",
        h("br", null),
        " decisions"),
      h("img", { class: "search-footer__img", src: getAssetPath('./assets/search.svg'), alt: "" })
    ];
  }
  render() {
    const startBtnClass = {
      'search-station-btn': true,
      'search-station-btn--empty': !noiStore.startId,
      'search-station-btn--start': true
    };
    const endBtnClass = {
      'search-station-btn': true,
      'search-station-btn--empty': !noiStore.endId,
      'search-station-btn--end': true
    };
    const hostClass = {
      'slide-in': this.hostClass.slideIn,
      'slide-out': this.hostClass.slideOut
    };
    return (h(Host, { class: hostClass },
      h("div", { class: "content" },
        h("header", null,
          h("noi-button", { class: "header__back-btn", fill: "clear", onClick: this.onSlideOut.bind(this) },
            h("svg", { slot: "icon-only", class: "header__icon", height: "14", viewBox: "0 0 10 14", width: "10", xmlns: "http://www.w3.org/2000/svg" },
              h("path", { d: "m0 1.53073535 1.28718658-1.53073535 8.35973178 7.02965056-8.35973178 7.02965054-1.28718658-1.5307353 6.53859329-5.49919813z", transform: "matrix(-1 0 0 1 9.646918 0)" }))),
          h("img", { class: "search__logo", src: getAssetPath('./assets/logo.svg'), alt: "BrennerLec" })),
        h("div", { class: "search__stations" },
          h("div", { class: "search-stations__wrapper" },
            h("div", { class: "search-stations__buttons" },
              h("noi-button", { class: startBtnClass, onClick: this.onInputClick.bind(this, 'start') },
                h("svg", { slot: "start", height: "20", viewBox: "0 0 14 20", width: "14", xmlns: "http://www.w3.org/2000/svg" },
                  h("path", { d: "m7 0c3.8659932 0 7 3.13400675 7 7 0 2.57732883-2.3333333 6.9106622-7 13l-.60839506-.8015058c-4.26106996-5.6695486-6.39160494-9.73571332-6.39160494-12.1984942 0-3.86599325 3.13400675-7 7-7z", "stroke-width": "2" })),
                this.getStart()),
              h("noi-button", { class: endBtnClass, onClick: this.onInputClick.bind(this, 'end') },
                h("svg", { slot: "start", height: "20", viewBox: "0 0 14 20", width: "14", xmlns: "http://www.w3.org/2000/svg" },
                  h("path", { d: "m7 0c3.8659932 0 7 3.13400675 7 7 0 2.57732883-2.3333333 6.9106622-7 13l-.60839506-.8015058c-4.26106996-5.6695486-6.39160494-9.73571332-6.39160494-12.1984942 0-3.86599325 3.13400675-7 7-7z", "stroke-width": "2" })),
                this.getEnd())),
            h("noi-button", { class: "search-reorder-btn", onClick: this.onReorderClick.bind(this) },
              h("svg", { slot: "icon-only", class: "search-reorder-btn__icon", height: "23", viewBox: "0 0 20 23", width: "20", xmlns: "http://www.w3.org/2000/svg" },
                h("path", { d: "m16.3379295 9 5.8258823 5.2432941-5.8258823 5.2432942-1.3379295-1.4865883 2.9659059-2.67-15.38399998.000353v-2l15.57799998-.000353-3.1599059-2.8434117zm-10.51204712-9 1.33792947 1.48658829-3.16081185 2.84341171 15.5789059.00035295v2l-15.3849059-.00035295 2.96681185 2.67-1.33792947 1.4865883-5.82588238-5.24329415z", transform: "matrix(0 1 -1 0 20 0)" }))))),
        this.renderDetails(),
        h("footer", null, this.renderFooter()))));
  }
  static get is() { return "noi-search"; }
  static get encapsulation() { return "scoped"; }
  static get originalStyleUrls() { return {
    "$": ["./search.css"]
  }; }
  static get styleUrls() { return {
    "$": ["search.css"]
  }; }
  static get states() { return {
    "durationMin": {},
    "hostClass": {}
  }; }
}
