import { Component, Event, Host, Listen, Prop, h } from '@stencil/core';
export class Backdrop {
  constructor() {
    this.overlayIndex = 1;
    this.visible = true;
    this.tappable = true;
    this.stopPropagation = true;
  }
  onMouseDown(ev) {
    this.emitTap(ev);
  }
  emitTap(ev) {
    if (this.stopPropagation) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    if (this.tappable) {
      this.noiBackdropTap.emit();
    }
  }
  render() {
    const hostClass = {
      'backdrop-hide': !this.visible,
      'backdrop-no-tappable': !this.tappable,
    };
    const hostStyle = {
      zIndex: `${this.visible ? this.overlayIndex : -1}`
    };
    return (h(Host, { tabindex: "-1", class: hostClass, style: hostStyle }));
  }
  static get is() { return "noi-backdrop"; }
  static get encapsulation() { return "scoped"; }
  static get originalStyleUrls() { return {
    "$": ["backdrop.css"]
  }; }
  static get styleUrls() { return {
    "$": ["backdrop.css"]
  }; }
  static get properties() { return {
    "overlayIndex": {
      "type": "number",
      "mutable": false,
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
      "attribute": "overlay-index",
      "reflect": false,
      "defaultValue": "1"
    },
    "visible": {
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
      "attribute": "visible",
      "reflect": false,
      "defaultValue": "true"
    },
    "tappable": {
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
      "attribute": "tappable",
      "reflect": false,
      "defaultValue": "true"
    },
    "stopPropagation": {
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
      "attribute": "stop-propagation",
      "reflect": false,
      "defaultValue": "true"
    }
  }; }
  static get events() { return [{
      "method": "noiBackdropTap",
      "name": "noiBackdropTap",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": ""
      },
      "complexType": {
        "original": "void",
        "resolved": "void",
        "references": {}
      }
    }]; }
  static get listeners() { return [{
      "name": "click",
      "method": "onMouseDown",
      "target": undefined,
      "capture": true,
      "passive": false
    }]; }
}
