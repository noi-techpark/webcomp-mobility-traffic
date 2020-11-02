import { Component, Element, Prop, Watch, h, State } from '@stencil/core';
import noiStore from '@noi/store';
import { translate } from '@noi/lang';
import { GeoJSON, Map, TileLayer } from 'leaflet';
import { MapEntityFactory } from './map-entity-factory';
function isNotAssigned(value) {
  return value === undefined || value === null || isNaN(value);
}
const TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export class NoiMap {
  constructor() {
    this.map = null;
    this.userMarker = null;
    this.childrenObserver = null;
    this.entityChildren = new WeakMap();
    this.pathChildren = new WeakMap();
    this.popupTimer = null;
    this.showPopup = false;
    this.lat = 46.4983;
    this.long = 11.3548;
    this.scale = 13;
  }
  componentDidLoad() {
    this.map = new Map(this.el, { zoomControl: false });
    this.entityFactory = new MapEntityFactory(this.map);
    this.updateCenterAndZoom();
    new TileLayer(TILE_LAYER).addTo(this.map);
    this.renderChildren();
    this.childrenObserver = new MutationObserver((mutations) => this.childrenObserverCallback(mutations));
    this.childrenObserver.observe(this.el, { attributes: false, childList: true, subtree: false });
  }
  disconnectedCallback() {
    this.childrenObserver.disconnect();
  }
  latHandler(newValue, _oldValue) {
    if (isNotAssigned(newValue)) {
      return;
    }
    this.updateCenterAndZoom();
  }
  longHandler(newValue, _oldValue) {
    if (isNotAssigned(newValue)) {
      return;
    }
    this.updateCenterAndZoom();
  }
  scaleHandler(newValue, _oldValue) {
    this.scale = newValue;
    this.updateCenterAndZoom();
  }
  entityAttrsObserver(el, mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type !== 'attributes')
        continue;
      if (['lat', 'long'].includes(mutation.attributeName)) {
        this.entityChildren.get(el).layer.setLatLng([el.getAttribute('lat'), el.getAttribute('long')]);
      }
      if (['class'].includes(mutation.attributeName)) {
        const layer = this.entityChildren.get(el).layer;
        const newClasses = (el.getAttribute('class') + '').split(' ');
        const oldClasses = (layer.getElement().classList.value + '').split(' ').filter(c => !c.startsWith('leaflet-'));
        oldClasses.forEach(c => {
          layer.getElement().classList.remove(c);
        });
        newClasses.forEach(c => {
          layer.getElement().classList.add(c);
        });
      }
    }
  }
  childrenObserverCallback(mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type !== 'childList')
        continue;
      this.removeChildren(mutation.removedNodes);
      this.renderChildren();
    }
  }
  removeChildren(nodes) {
    nodes.forEach(node => {
      if (!node.nodeName.startsWith("NOI-")) {
        return;
      }
      const entityEl = this.entityChildren.get(node);
      if (entityEl) {
        this.map.removeLayer(entityEl.layer);
        if (entityEl.observer)
          entityEl.observer.disconnect();
        this.entityChildren.delete(node);
        return;
      }
      const pathEl = this.pathChildren.get(node);
      if (pathEl) {
        this.map.removeLayer(pathEl.layer);
        if (pathEl.observer) {
          pathEl.observer.disconnect();
        }
        this.pathChildren.delete(node);
        return;
      }
    });
  }
  renderMapEntity(e) {
    const layer = this.entityFactory.createLayer(e);
    const observer = new MutationObserver((mutations, _observer) => this.entityAttrsObserver(e, mutations));
    observer.observe(e, { attributes: true, childList: false, subtree: false });
    this.entityChildren.set(e, { layer, observer });
    layer.addTo(this.map);
    layer.bindPopup(this.popupElement, { minWidth: 400 });
    layer.getPopup().on('remove', () => noiStore.selectedId = '');
  }
  renderGeoJson(e) {
    const geometry = JSON.parse(e.getAttribute('geometry'));
    const layer = new GeoJSON(geometry, {
      style: {
        className: 'noi-map-path',
      },
    });
    this.pathChildren.set(e, { layer, observer: null });
    layer.addTo(this.map);
  }
  renderChildren() {
    Array.from(this.el.children).map(e => {
      if (this.entityChildren.get(e) !== undefined) {
        return;
      }
      if (this.pathChildren.get(e) !== undefined) {
        return;
      }
      switch (e.nodeName) {
        case 'NOI-MAP-ENTITY':
          this.renderMapEntity(e);
          break;
        case 'NOI-MAP-ROUTE':
          this.renderGeoJson(e);
          break;
        default:
          break;
      }
    });
  }
  updateCenterAndZoom() {
    if (isNotAssigned(this.lat) || isNotAssigned(this.long)) {
      return;
    }
    this.map.setView([this.lat, this.long], this.scale);
  }
  onSetAsStart() {
    noiStore.startId = noiStore.selectedId;
    noiStore.selectedId = '';
    this.map.closePopup();
  }
  onSetAsEnd() {
    noiStore.endId = noiStore.selectedId;
    noiStore.selectedId = '';
    this.map.closePopup();
  }
  renderSetAsStartButton() {
    if (noiStore.selectedId === noiStore.startId) {
      return null;
    }
    return (h("noi-button", { fill: "solid", class: "button-md station-popup__btn", onClick: this.onSetAsStart.bind(this) }, translate('map-popup.from')));
  }
  renderSetAsEndButton() {
    if (noiStore.selectedId === noiStore.endId) {
      return null;
    }
    return (h("noi-button", { fill: "solid", class: "button-md station-popup__btn", onClick: this.onSetAsEnd.bind(this) }, translate('map-popup.to')));
  }
  renderSelectedStationPopup() {
    return (h("div", { class: "station-popup" },
      h("div", { class: "station-popup__header" }, noiStore.selectedId ? noiStore.selected.name : ''),
      h("div", { class: "station-popup__content" },
        this.renderSetAsStartButton(),
        this.renderSetAsEndButton())));
  }
  render() {
    const popupClass = {
      'popup-container': true,
      'popup-container--visible': noiStore.mapPopup
    };
    return h("div", { class: popupClass, ref: (el) => this.popupElement = el }, this.renderSelectedStationPopup());
  }
  static get is() { return "noi-map"; }
  static get originalStyleUrls() { return {
    "$": ["map.css"]
  }; }
  static get styleUrls() { return {
    "$": ["map.css"]
  }; }
  static get properties() { return {
    "lat": {
      "type": "number",
      "mutable": true,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "lat",
      "reflect": false,
      "defaultValue": "46.4983"
    },
    "long": {
      "type": "number",
      "mutable": true,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "long",
      "reflect": false,
      "defaultValue": "11.3548"
    },
    "scale": {
      "type": "number",
      "mutable": true,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "scale",
      "reflect": false,
      "defaultValue": "13"
    }
  }; }
  static get states() { return {
    "showPopup": {}
  }; }
  static get elementRef() { return "el"; }
  static get watchers() { return [{
      "propName": "lat",
      "methodName": "latHandler"
    }, {
      "propName": "long",
      "methodName": "longHandler"
    }, {
      "propName": "scale",
      "methodName": "scaleHandler"
    }]; }
}
