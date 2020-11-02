import { NoiAPI } from '@noi/api';
import { urbanPathState } from '@noi/store/path-store';
import noiStore, { selectStartEnd, selectStationsWithSelectedWithStartEnd } from '@noi/store';
import { NoiError, NOI_ERR_UNKNOWN } from '@noi/api/error';
import { getLocaleComponentStrings, translate } from '@noi/lang';
import { Component, Element, State, h, getAssetPath } from '@stencil/core';
import ResizeObserver from 'resize-observer-polyfill';
import { MapMarker } from './blocks/map/map-marker';
import { MapStation } from './blocks/map/map-station';
const rIC = (callback) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback);
  }
  else {
    setTimeout(callback, 32);
  }
};
export class NoiMobilityTraffic {
  constructor() {
    this.showSearch = true;
    this.errorCode = undefined;
    this.loading = true;
  }
  async loadLocaleAndStations() {
    this.errorCode = undefined;
    this.loading = true;
    try {
      await getLocaleComponentStrings(this.element);
      const stations = await NoiAPI.getHighwayStations();
      noiStore.stations = stations.reduce((result, s) => { result[s.id] = s; return result; }, {});
      this.loading = false;
    }
    catch (error) {
      if (error instanceof NoiError) {
        this.errorCode = error.code;
      }
      else {
        this.errorCode = NOI_ERR_UNKNOWN;
      }
      this.loading = false;
    }
  }
  async componentDidLoad() {
    await this.loadLocaleAndStations();
    rIC(() => {
      import('./components/tap-click').then(module => module.startTapClick());
    });
    this.resizeObserver = new ResizeObserver(([entry]) => {
      this.applyMediaClasses(entry.contentRect.width, entry.contentRect.height);
    });
    this.resizeObserver.observe(this.element);
  }
  disconnectedCallback() {
    this.resizeObserver.disconnect();
  }
  applyMediaClasses(widthPx, heightPx) {
    const greaterThanSmall = widthPx > 600;
    const greaterThanSmallLandscape = greaterThanSmall && widthPx > heightPx;
    this.element.classList.toggle('noi-media-gs', greaterThanSmall);
    this.element.classList.toggle('noi-media-gs--landscape', greaterThanSmallLandscape);
    if (this.stationsModalEl) {
      this.stationsModalEl.classList.toggle('noi-media-gs', greaterThanSmall);
      this.stationsModalEl.classList.toggle('noi-media-gs--landscape', greaterThanSmallLandscape);
    }
    if (this.searchEl) {
      this.searchEl.classList.toggle('noi-media-gs', greaterThanSmall);
      this.searchEl.classList.toggle('noi-media-gs--landscape', greaterThanSmallLandscape);
    }
  }
  getHighwayCircles() {
    if (!noiStore.stations) {
      return null;
    }
    return selectStationsWithSelectedWithStartEnd().map(s => {
      return (h(MapStation, Object.assign({}, s)));
    });
  }
  getPathCircles() {
    if (!noiStore.stations) {
      return null;
    }
    return selectStationsWithSelectedWithStartEnd().map(s => {
      return (h(MapStation, Object.assign({}, s)));
    });
  }
  getUrbanPath() {
    if (noiStore.activePath !== 'urban') {
      return null;
    }
    if (urbanPathState.loading || urbanPathState.errorCode || !urbanPathState.path) {
      return null;
    }
    return urbanPathState.path.map(s => (h("noi-map-route", { geometry: JSON.stringify(s.geometry) })));
  }
  getHighwayMarkers() {
    if (!noiStore.startId && !noiStore.endId) {
      return null;
    }
    return selectStartEnd().map(s => (h(MapMarker, Object.assign({}, s))));
  }
  getAllLinkStations(linkStations) {
    return linkStations.map(s => {
      return h("leaflet-geojson", { geometry: JSON.stringify(s.geometry) });
    });
  }
  onModalClose() {
    noiStore.selecting = null;
  }
  render() {
    if (this.loading) {
      return (h("div", { class: "wrapper" },
        h("div", { class: "loading" },
          h("div", { class: "loading-img" },
            h("img", { src: getAssetPath('./assets/search.svg'), alt: "" })))));
    }
    if (this.errorCode) {
      return (h("div", { class: "wrapper" },
        h("div", { class: "error" },
          h("h2", null, translate(this.errorCode)),
          h("noi-button", { fill: "solid", class: "button-md error-btn", onClick: this.loadLocaleAndStations.bind(this) }, "Retry"))));
    }
    urbanPathState.startId = noiStore.startId;
    urbanPathState.endId = noiStore.endId;
    return h("div", { class: "wrapper" },
      h("noi-backdrop", { overlayIndex: 2, visible: !!noiStore.selecting, onNoiBackdropTap: this.onModalClose.bind(this) }),
      h("noi-stations-modal", { ref: el => this.stationsModalEl = el, selecting: noiStore.selecting, onModalClose: this.onModalClose.bind(this), overlayIndex: 2, visible: !!noiStore.selecting }),
      h("noi-search", { ref: el => this.searchEl = el }),
      h("noi-map", { lat: noiStore.mapCenter.lat, long: noiStore.mapCenter.long },
        this.getUrbanPath(),
        this.getHighwayCircles(),
        this.getHighwayMarkers()));
  }
  static get is() { return "noi-mobility-traffic"; }
  static get encapsulation() { return "scoped"; }
  static get originalStyleUrls() { return {
    "$": ["noi-mobility-traffic.css"]
  }; }
  static get styleUrls() { return {
    "$": ["noi-mobility-traffic.css"]
  }; }
  static get assetsDirs() { return ["assets"]; }
  static get states() { return {
    "showSearch": {},
    "errorCode": {},
    "loading": {}
  }; }
  static get elementRef() { return "element"; }
}
