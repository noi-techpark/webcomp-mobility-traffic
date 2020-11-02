import { Component, h, Host, Prop } from '@stencil/core';
export class StationItem {
  constructor() {
    this.isStart = false;
    this.isEnd = false;
  }
  render() {
    const hostClass = {
      'station-item--end': this.isEnd,
      'station-item--start': this.isStart,
    };
    return (h(Host, { class: hostClass },
      h("svg", { height: "20", viewBox: "-4 0 20 24", width: "14", xmlns: "http://www.w3.org/2000/svg" },
        h("path", { d: "m7 0c3.8659932 0 7 3.13400675 7 7 0 2.57732883-2.3333333 6.9106622-7 13l-.60839506-.8015058c-4.26106996-5.6695486-6.39160494-9.73571332-6.39160494-12.1984942 0-3.86599325 3.13400675-7 7-7z" })),
      h("h3", null, this.name),
      "\u00A0",
      this.position ? h("p", null,
        (this.position / 1000).toFixed(1),
        " km") : null));
  }
  static get is() { return "noi-station-item"; }
  static get encapsulation() { return "scoped"; }
  static get originalStyleUrls() { return {
    "$": ["./station-item.css"]
  }; }
  static get styleUrls() { return {
    "$": ["station-item.css"]
  }; }
  static get properties() { return {
    "name": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": true,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "name",
      "reflect": false
    },
    "position": {
      "type": "number",
      "mutable": false,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": true,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "position",
      "reflect": false
    },
    "isStart": {
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
      "attribute": "is-start",
      "reflect": false,
      "defaultValue": "false"
    },
    "isEnd": {
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
      "attribute": "is-end",
      "reflect": false,
      "defaultValue": "false"
    }
  }; }
}
