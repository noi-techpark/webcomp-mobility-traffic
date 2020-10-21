import { r as registerInstance, h, e as Host } from './index-375c0366.js';

const urbanPathCss = "";

const UrbanPathDetails = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.urbanPath = undefined;
    this.errorCode = undefined;
    this.urbanStations = undefined;
    this.segments = undefined;
  }
  render() {
    const hostClass = {};
    return (h(Host, { class: hostClass }, h("div", { class: "content" }, this.segments.map((s, i) => h("noi-station-item", { name: s.name, position: s.position, isStart: i === 0, isEnd: i === this.segments.length - 1 })))));
  }
};
UrbanPathDetails.style = urbanPathCss;

export { UrbanPathDetails as noi_urban_path };
