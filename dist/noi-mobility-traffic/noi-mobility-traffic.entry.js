import { r as registerInstance, h } from './index-4debd3b5.js';

const noiMobilityTrafficCss = ":host{display:block;background:var(--noi-mt-background);width:var(--noi-mt-width);height:var(--noi-mt-height)}";

const NoiMobilityTraffic = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return h("div", null, "Hello, World!");
  }
};
NoiMobilityTraffic.style = noiMobilityTrafficCss;

export { NoiMobilityTraffic as noi_mobility_traffic };
