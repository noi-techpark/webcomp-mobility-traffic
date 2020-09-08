import { Component, Prop, Watch, Element } from '@stencil/core';
import L from 'leaflet';
export class LeafletMarker {
  constructor() {
    this.lmap = null;
    this.dmarker = null;
    this.userMarker = null;
    this.observer = null;
    this.children = new WeakMap();
    this.tileLayer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    this.iconUrl = '';
    this.iconHeight = 32;
    this.iconWidth = 32;
    this.latitude = 51.505;
    this.longitude = -0.09;
    this.scale = 13;
    this.userLatitude = 0;
    this.userLongitude = 0;
    this.userIconUrl = '';
    this.userIconWidth = 0;
    this.userIconHeight = 0;
  }
  componentDidLoad() {
    this.lmap = L.map(this.el);
    this.setView();
    this.setTileLayer();
    this.setScale();
    this.setChildren();
    this.setDefaultMarker();
    this.setUserMarker();
    this.observer = new MutationObserver((mutations, _observer) => this.childrenObserver(mutations));
    this.observer.observe(this.el, { attributes: false, childList: true, subtree: false });
  }
  disconnectedCallback() {
    this.observer.disconnect();
  }
  defaultPopupHandler(newValue, _oldValue) {
    this.defaultPopup = newValue;
    this.setDefaultIcon();
    this.updateDefaultPopup();
  }
  iconHeightHandler(newValue, _oldValue) {
    this.iconHeight = newValue;
    this.setDefaultIcon();
  }
  iconUrlHandler(newValue, _oldValue) {
    this.iconUrl = newValue;
    this.setDefaultIcon();
  }
  iconWidthHandler(newValue, _oldValue) {
    this.iconWidth = newValue;
    this.setDefaultIcon();
  }
  latitudeHandler(newValue, _oldValue) {
    this.latitude = newValue;
    this.setView();
    this.updateDefaultMarker();
    this.updateDefaultPopup();
  }
  longitudeHandler(newValue, _oldValue) {
    this.longitude = newValue;
    this.setView();
    this.updateDefaultMarker();
    this.updateDefaultPopup();
  }
  scaleHandler(newValue, _oldValue) {
    this.scale = newValue;
    this.setView();
  }
  userLatitudeHandler(newValue, _oldValue) {
    this.userLatitude = newValue;
    this.updateUserMarker();
  }
  userLongitudeHandler(newValue, _oldValue) {
    this.userLongitude = newValue;
    this.updateUserMarker();
  }
  userIconUrlHandler(newValue, _oldValue) {
    this.userIconUrl = newValue;
    this.updateUserMarker();
  }
  userIconWidthHandler(newValue, _oldValue) {
    this.userIconWidth = newValue;
    this.updateUserMarker();
  }
  userIconHeightHandler(newValue, _oldValue) {
    this.userIconHeight = newValue;
    this.updateUserMarker();
  }
  updateUserMarker() {
    if (this.userLatitude === undefined || this.userLatitude === null || isNaN(this.userLatitude) ||
      this.userLongitude === undefined || this.userLongitude === null || isNaN(this.userLongitude))
      return;
    this.userMarker.setLatLng([this.userLatitude, this.userLongitude]);
    if (!this.userIconUrl)
      return;
    const icon = L.icon({
      iconUrl: this.userIconUrl,
      iconSize: [this.userIconWidth || 32, this.userIconHeight || 32]
    });
    this.userMarker.setIcon(icon);
  }
  setUserMarker() {
    if (this.userLatitude === undefined || this.userLatitude === null || isNaN(this.userLatitude) ||
      this.userLongitude === undefined || this.userLongitude === null || isNaN(this.userLongitude))
      return;
    this.userMarker = L.marker([this.userLatitude, this.userLongitude]);
    this.userMarker.addTo(this.lmap);
    if (!this.userIconUrl)
      return;
    const icon = L.icon({
      iconUrl: this.userIconUrl,
      iconSize: [this.userIconWidth || 32, this.userIconHeight || 32]
    });
    this.userMarker.setIcon(icon);
  }
  attributesObserver(el, mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type !== 'attributes')
        continue;
      if (['latitude', 'longitude'].includes(mutation.attributeName)) {
        this.children.get(el).layer.setLatLng([el.getAttribute('latitude'), el.getAttribute('longitude')]);
      }
      if (['icon-height', 'icon-url', 'icon-width'].includes(mutation.attributeName)) {
        const icon = this.getIcon(el);
        this.children.get(el).layer.setIcon(icon);
      }
    }
  }
  childrenObserver(mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type !== 'childList')
        continue;
      this.removeChildren(mutation.removedNodes);
      this.setChildren();
    }
  }
  getIcon(el) {
    return L.icon({
      iconUrl: el.getAttribute('icon-url'),
      iconSize: [el.getAttribute('icon-width') || 32, el.getAttribute('icon-height') || 32]
    });
  }
  removeChildren(nodes) {
    nodes.forEach(node => {
      if (!node.nodeName.startsWith("LEAFLET-"))
        return;
      const el = this.children.get(node);
      this.lmap.removeLayer(el.layer);
      if (el.observer)
        el.observer.disconnect();
      this.children.delete(node);
    });
  }
  setChildren() {
    Array.from(this.el.children)
      .map(e => {
      if (this.children.get(e) !== undefined)
        return;
      if (e.nodeName === "LEAFLET-MARKER") {
        const observer = new MutationObserver((mutations, _observer) => this.attributesObserver(e, mutations));
        observer.observe(e, { attributes: true, childList: false, subtree: false });
        const marker = {
          layer: L.marker([e.getAttribute('latitude'), e.getAttribute('longitude')]),
          observer,
        };
        this.children.set(e, marker);
        marker.layer.addTo(this.lmap);
        if (e.textContent) {
          marker.layer.bindPopup(e.textContent).openPopup();
        }
        if (e.getAttribute('icon-url')) {
          const icon = this.getIcon(e);
          marker.layer.setIcon(icon);
        }
      }
      else if (e.nodeName === "LEAFLET-CIRCLE") {
        const opts = {
          radius: e.getAttribute('radius'),
          stroke: e.hasAttribute('stroke'),
          color: e.hasAttribute('color') ? e.getAttribute('color') : "#3388ff",
          weight: e.hasAttribute('weight') ? e.getAttribute('weight') : 3,
          opacity: e.hasAttribute('opacity') ? e.getAttribute('opacity') : 1.0,
          lineCap: e.hasAttribute('line-cap') ? e.getAttribute('line-cap') : "round",
          lineJoin: e.hasAttribute('line-join') ? e.getAttribute('line-join') : "round",
          dashArray: e.hasAttribute('dash-array') ? e.getAttribute('dash-array') : null,
          dashOffset: e.hasAttribute('dash-offset') ? e.getAttribute('dash-offset') : null,
          fill: e.hasAttribute('fill') && e.getAttribute('fill') == "false" ? false : true,
          fillColor: e.hasAttribute('fill-color') ? e.getAttribute('fill-color') : "#3388ff",
          fillOpacity: e.hasAttribute('fill-opacity') ? e.getAttribute('fill-opacity') : 0.2,
          fillRule: e.hasAttribute('fill-rule') ? e.getAttribute('fill-rule') : "evenodd",
          bubblingMouseEvents: e.hasAttribute('bubbling-mouse-events'),
        };
        const circle = {
          layer: L.circle([e.getAttribute('latitude'), e.getAttribute('longitude')], opts),
          observer: null,
        };
        this.children.set(e, circle);
        circle.layer.addTo(this.lmap);
      }
    });
  }
  setDefaultIcon() {
    if (this.iconUrl) {
      const icon = L.icon({
        iconUrl: this.iconUrl,
        iconSize: [this.iconWidth, this.iconHeight]
      });
      this.dmarker.setIcon(icon);
    }
  }
  setDefaultMarker() {
    if (this.showDefaultMarker) {
      if (this.defaultPopup) {
        this.dmarker = L.marker([this.latitude, this.longitude])
          .addTo(this.lmap)
          .bindPopup(this.defaultPopup)
          .openPopup();
      }
      else {
        this.dmarker = L.marker([this.latitude, this.longitude]).addTo(this.lmap);
      }
      this.setDefaultIcon();
    }
  }
  setScale() {
    if (this.showScale) {
      L.control.scale().addTo(this.lmap);
    }
  }
  setTileLayer() {
    L.tileLayer(this.tileLayer).addTo(this.lmap);
  }
  setView() {
    this.lmap.setView([this.latitude, this.longitude], this.scale);
  }
  updateDefaultMarker() {
    if (this.showDefaultMarker) {
      this.dmarker.setLatLng([this.latitude, this.longitude]);
    }
  }
  updateDefaultPopup() {
    if (this.showDefaultMarker && this.defaultPopup) {
      this.dmarker
        .bindPopup(this.defaultPopup, { offset: L.point(0, 6 - this.iconHeight / 2) })
        .openPopup();
    }
  }
  static get is() { return "noi-mobility-map"; }
  static get originalStyleUrls() { return {
    "$": ["noi-mobility-map.css"]
  }; }
  static get styleUrls() { return {
    "$": ["noi-mobility-map.css"]
  }; }
  static get properties() { return {
    "tileLayer": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "tile-layer",
      "reflect": false,
      "defaultValue": "'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'"
    },
    "iconUrl": {
      "type": "string",
      "mutable": true,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "icon-url",
      "reflect": false,
      "defaultValue": "''"
    },
    "iconHeight": {
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
      "attribute": "icon-height",
      "reflect": false,
      "defaultValue": "32"
    },
    "iconWidth": {
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
      "attribute": "icon-width",
      "reflect": false,
      "defaultValue": "32"
    },
    "latitude": {
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
      "attribute": "latitude",
      "reflect": false,
      "defaultValue": "51.505"
    },
    "longitude": {
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
      "attribute": "longitude",
      "reflect": false,
      "defaultValue": "-0.09"
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
    },
    "showScale": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "show-scale",
      "reflect": false
    },
    "showDefaultMarker": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "show-default-marker",
      "reflect": false
    },
    "defaultPopup": {
      "type": "string",
      "mutable": true,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "default-popup",
      "reflect": false
    },
    "userLatitude": {
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
      "attribute": "user-latitude",
      "reflect": false,
      "defaultValue": "0"
    },
    "userLongitude": {
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
      "attribute": "user-longitude",
      "reflect": false,
      "defaultValue": "0"
    },
    "userIconUrl": {
      "type": "string",
      "mutable": true,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "user-icon-url",
      "reflect": false,
      "defaultValue": "''"
    },
    "userIconWidth": {
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
      "attribute": "user-icon-width",
      "reflect": false,
      "defaultValue": "0"
    },
    "userIconHeight": {
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
      "attribute": "user-icon-height",
      "reflect": false,
      "defaultValue": "0"
    }
  }; }
  static get elementRef() { return "el"; }
  static get watchers() { return [{
      "propName": "defaultPopup",
      "methodName": "defaultPopupHandler"
    }, {
      "propName": "iconHeight",
      "methodName": "iconHeightHandler"
    }, {
      "propName": "iconUrl",
      "methodName": "iconUrlHandler"
    }, {
      "propName": "iconWidth",
      "methodName": "iconWidthHandler"
    }, {
      "propName": "latitude",
      "methodName": "latitudeHandler"
    }, {
      "propName": "longitude",
      "methodName": "longitudeHandler"
    }, {
      "propName": "scale",
      "methodName": "scaleHandler"
    }, {
      "propName": "userLatitude",
      "methodName": "userLatitudeHandler"
    }, {
      "propName": "userLongitude",
      "methodName": "userLongitudeHandler"
    }, {
      "propName": "userIconUrl",
      "methodName": "userIconUrlHandler"
    }, {
      "propName": "userIconWidth",
      "methodName": "userIconWidthHandler"
    }, {
      "propName": "userIconHeight",
      "methodName": "userIconHeightHandler"
    }]; }
}
