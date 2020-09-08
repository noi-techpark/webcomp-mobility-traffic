import { Component, h, Element } from '@stencil/core';
import { getLocaleComponentStrings } from '../../utils/locale';
export class NoiMobilityTraffic {
  async componentWillLoad() {
    this.strings = await getLocaleComponentStrings(this.element);
  }
  render() {
    return h("div", { class: "wrapper" },
      h("div", null, this.strings.title),
      h("noi-mobility-map", { class: "map" }));
  }
  static get is() { return "noi-mobility-traffic"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["noi-mobility-traffic.css"]
  }; }
  static get styleUrls() { return {
    "$": ["noi-mobility-traffic.css"]
  }; }
  static get elementRef() { return "element"; }
}
