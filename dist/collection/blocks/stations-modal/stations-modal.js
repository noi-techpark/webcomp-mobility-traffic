import { Host, Component, h, Prop, Event, State, Watch } from '@stencil/core';
import noiStore, { selectStationsWithSelected } from '@noi/store';
import { translate } from '@noi/lang';
export class StationsModal {
  constructor() {
    this.visible = false;
    this.selecting = 'start';
    this.overlayIndex = 1;
    this.searchText = '';
    this.hostClass = {};
  }
  onVisibleChange(newValue) {
    this.hostClass = this.getHostClass(newValue);
  }
  onClose() {
    this.modalClose.emit();
    this.searchText = '';
  }
  getTitle() {
    return translate(`stations-modal.header-${this.selecting}`);
  }
  onSearchChange(value) {
    this.searchText = value ? value.detail.value.toLowerCase() : '';
  }
  stationSelectedToggle(id) {
    noiStore.selectedId = id;
  }
  onSelectStation(id) {
    if (this.selecting === 'start') {
      noiStore.startId = id;
    }
    if (this.selecting === 'end') {
      noiStore.endId = id;
    }
  }
  renderStations() {
    if (!noiStore.stationsList) {
      return null;
    }
    const notSelectedId = this.selecting === 'start' ? noiStore.endId : noiStore.startId;
    return selectStationsWithSelected()
      .filter(s => s.name.toLowerCase().includes(this.searchText) && s.id !== notSelectedId)
      .map(s => {
      const stationClass = {
        station: true,
        'station--selected': s.selected,
        'station--end': this.selecting === 'end'
      };
      return (h("article", { class: stationClass, onClick: this.stationSelectedToggle.bind(this, s.id) },
        h("svg", { class: "station__icon", height: "20", viewBox: "-4 -4 20 24", width: "14", xmlns: "http://www.w3.org/2000/svg" },
          h("path", { d: "m7 0c3.8659932 0 7 3.13400675 7 7 0 2.57732883-2.3333333 6.9106622-7 13l-.60839506-.8015058c-4.26106996-5.6695486-6.39160494-9.73571332-6.39160494-12.1984942 0-3.86599325 3.13400675-7 7-7z", "stroke-width": "2" })),
        s.name,
        h("noi-button", { size: "small", class: "station__select-btn button-md", onClick: this.onSelectStation.bind(this, s.id) }, translate('stations-modal.select-btn'))));
    });
  }
  getHostClass(visible) {
    if (visible) {
      return { slideIn: true };
    }
    if (!visible && this.hostClass.slideIn) {
      return { slideOut: true };
    }
    return {};
  }
  render() {
    const hostClass = {
      'slide-in': this.hostClass.slideIn,
      'slide-out': this.hostClass.slideOut
    };
    const hostStyle = {
      zIndex: `${this.overlayIndex + 1}`,
    };
    return (h(Host, { class: hostClass, style: hostStyle },
      h("div", { class: "wrapper" },
        h("header", null,
          h("noi-button", { fill: "clear", onClick: this.onClose.bind(this) },
            h("svg", { slot: "icon-only", class: "header__icon", height: "14", viewBox: "0 0 10 14", width: "10", xmlns: "http://www.w3.org/2000/svg" },
              h("path", { d: "m0 1.53073535 1.28718658-1.53073535 8.35973178 7.02965056-8.35973178 7.02965054-1.28718658-1.5307353 6.53859329-5.49919813z", transform: "matrix(-1 0 0 1 9.646918 0)" }))),
          h("span", { class: "header__title" }, this.getTitle())),
        h("div", { class: "search" },
          h("noi-input", { debounce: 100, onNoiChange: this.onSearchChange.bind(this), placeholder: translate('stations-modal.input-placeholder') })),
        h("div", { class: "list" }, this.renderStations()))));
  }
  static get is() { return "noi-stations-modal"; }
  static get encapsulation() { return "scoped"; }
  static get originalStyleUrls() { return {
    "$": ["./stations-modal.css"]
  }; }
  static get styleUrls() { return {
    "$": ["stations-modal.css"]
  }; }
  static get assetsDirs() { return ["../../assets"]; }
  static get properties() { return {
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
      "defaultValue": "false"
    },
    "selecting": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "'start' | 'end'",
        "resolved": "\"end\" | \"start\"",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "selecting",
      "reflect": false,
      "defaultValue": "'start'"
    },
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
    }
  }; }
  static get states() { return {
    "searchText": {},
    "hostClass": {}
  }; }
  static get events() { return [{
      "method": "modalClose",
      "name": "modalClose",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": ""
      },
      "complexType": {
        "original": "{stationId: string}",
        "resolved": "{ stationId: string; }",
        "references": {}
      }
    }]; }
  static get watchers() { return [{
      "propName": "visible",
      "methodName": "onVisibleChange"
    }]; }
}
