import { Component, h, Host } from '@stencil/core';
import { urbanPathState } from '@noi/store/path-store';
export class UrbanPathDetails {
  renderContent() {
    if (urbanPathState.loading) {
      return (h("div", null, "Loading..."));
      // TODO:
    }
    if (urbanPathState.errorCode) {
      return (h("div", null,
        "Error ",
        urbanPathState.errorCode));
      // TODO:
    }
    if (!urbanPathState.stations || !urbanPathState.stations.length) {
      return (h("div", null, "No path"));
    }
    return urbanPathState.stations.map((s, i) => h("noi-station-item", { name: s.name, position: s.position, isStart: i === 0 }));
  }
  render() {
    const hostClass = {};
    return (h(Host, { class: hostClass },
      h("div", { class: "content" }, this.renderContent())));
  }
  static get is() { return "noi-urban-path"; }
  static get encapsulation() { return "scoped"; }
  static get originalStyleUrls() { return {
    "$": ["./urban-path.css"]
  }; }
  static get styleUrls() { return {
    "$": ["urban-path.css"]
  }; }
}
