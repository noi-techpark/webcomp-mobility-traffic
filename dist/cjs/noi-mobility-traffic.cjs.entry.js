'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-de9e07ef.js');

function format(first, middle, last) {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}

const noiMobilityTrafficCss = ":host{display:block}";

const NoiMobilityTraffic = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  getText() {
    return format(this.first, this.middle, this.last);
  }
  render() {
    return index.h("div", null, "Hello, World! I'm ", this.getText());
  }
};
NoiMobilityTraffic.style = noiMobilityTrafficCss;

exports.noi_mobility_traffic = NoiMobilityTraffic;
