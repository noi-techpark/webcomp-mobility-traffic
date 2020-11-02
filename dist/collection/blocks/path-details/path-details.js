import { Component, Event, h, Host, Prop, State, Watch } from '@stencil/core';
import { NoiAPI } from '@noi/api';
import { selectPathSegmentsIds, selectPathStations } from '@noi/store';
import { urbanPathState } from '@noi/store/path-store';
import { formatDuration } from '@noi/utils';
import { translate } from '@noi/lang';
export class PathDetails {
  constructor() {
    this.segmentsTime = undefined;
    this.activePath = 'highway';
    this.highwayTimeMin = undefined;
  }
  async componentDidLoad() {
    await this.updateState();
  }
  async updateStart(_, oldValue) {
    if (!!oldValue) {
      await this.updateState();
    }
  }
  async updateStop(_, oldValue) {
    if (!!oldValue) {
      await this.updateState();
    }
  }
  async updateState() {
    this.highwayTimeMin = undefined;
    this.segmentsTime = undefined;
    const highwayPath = selectPathSegmentsIds();
    try {
      const segmentsTime = await NoiAPI.getLinkStationsTime(highwayPath, true);
      this.segmentsTime = segmentsTime.reduce((result, i) => { result[i.id] = i.timeSec; return result; }, {});
      this.highwayTimeMin = Math.round(segmentsTime.reduce((result, i) => { result += i.timeSec; return result; }, 0) / 60);
    }
    catch (error) {
      alert('TODO: Unable to load A22 path duration');
    }
  }
  onActivatePath(value) {
    this.toggleActive.emit(value);
    this.activePath = value;
  }
  renderPath() {
    if (this.activePath === 'urban') {
      return h("noi-urban-path", null);
    }
    const stations = selectPathStations();
    if (!stations || !stations.length) {
      return null;
    }
    const startPos = stations[0].position;
    return h("div", { class: "content" }, stations.map(s => h("noi-station-item", { name: s.name, position: Math.abs(startPos - s.position), isStart: !!s.isStart, isEnd: !!s.isEnd })));
  }
  render() {
    const hostClass = {};
    const highwayHeaderClass = {
      'header__section': true,
      'header__section--active': this.activePath === 'highway'
    };
    const urbanHeaderClass = {
      'header__section': true,
      'header__section--active': this.activePath === 'urban'
    };
    return (h(Host, { class: hostClass },
      h("header", null,
        this.highwayTimeMin ?
          h("noi-button", { class: highwayHeaderClass, onClick: this.onActivatePath.bind(this, 'highway') },
            h("p", null,
              h("span", { class: "header-highway__title" }, translate('path-details.highway-name')),
              " ",
              formatDuration(this.highwayTimeMin)))
          : null,
        urbanPathState.durationMin !== undefined ?
          h("noi-button", { class: urbanHeaderClass, onClick: this.onActivatePath.bind(this, 'urban') },
            h("span", { class: "header-highway__title" }, translate('path-details.urban-name')),
            " ",
            formatDuration(urbanPathState.durationMin))
          : null),
      this.renderPath()));
  }
  static get is() { return "noi-path-details"; }
  static get encapsulation() { return "scoped"; }
  static get originalStyleUrls() { return {
    "$": ["./path-details.css"]
  }; }
  static get styleUrls() { return {
    "$": ["path-details.css"]
  }; }
  static get properties() { return {
    "startId": {
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
      "attribute": "start-id",
      "reflect": false
    },
    "endId": {
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
      "attribute": "end-id",
      "reflect": false
    }
  }; }
  static get states() { return {
    "segmentsTime": {},
    "activePath": {},
    "highwayTimeMin": {}
  }; }
  static get events() { return [{
      "method": "toggleActive",
      "name": "toggleActive",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": ""
      },
      "complexType": {
        "original": "'urban' | 'highway'",
        "resolved": "\"highway\" | \"urban\"",
        "references": {}
      }
    }]; }
  static get watchers() { return [{
      "propName": "startId",
      "methodName": "updateStart"
    }, {
      "propName": "endId",
      "methodName": "updateStop"
    }]; }
}
