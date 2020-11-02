import { r as registerInstance, h, k as Host } from './index-54a7bd8b.js';
import './index-0fe06bad.js';
import './leaflet-src-ee2a66f1.js';
import { u as urbanPathState } from './path-store-4ee1d5c1.js';

const urbanPathCss = ".content.sc-noi-urban-path{overflow-y:auto;overflow-x:hidden;height:100%;position:relative}noi-station-item.sc-noi-urban-path:last-of-type{margin-bottom:100px}";

const UrbanPathDetails = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  renderContent() {
    if (urbanPathState.loading) {
      return (h("div", null, "Loading..."));
      // TODO:
    }
    if (urbanPathState.errorCode) {
      return (h("div", null, "Error ", urbanPathState.errorCode));
      // TODO:
    }
    if (!urbanPathState.stations || !urbanPathState.stations.length) {
      return (h("div", null, "No path"));
    }
    return urbanPathState.stations.map((s, i) => h("noi-station-item", { name: s.name, position: s.position, isStart: i === 0 }));
  }
  render() {
    const hostClass = {};
    return (h(Host, { class: hostClass }, h("div", { class: "content" }, this.renderContent())));
  }
};
UrbanPathDetails.style = urbanPathCss;

export { UrbanPathDetails as noi_urban_path };
