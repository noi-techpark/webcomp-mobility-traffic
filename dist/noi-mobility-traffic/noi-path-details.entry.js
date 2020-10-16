import { r as registerInstance, h, e as Host } from './index-375c0366.js';
import { N as NoiAPI } from './index-942666ae.js';
import { e as selectPathSegmentsIds, f as selectPathStations } from './index-2a350c08.js';

const pathDetailsCss = ".sc-noi-path-details-h{display:flex;flex-direction:column}header.sc-noi-path-details{background:rgba(var(--noi-primary-rgb), 0.3);display:flex;width:100%;height:48px;padding:8px;margin-bottom:auto}.header__section.sc-noi-path-details{background:var(--noi-primary-contrast);flex:1}.content.sc-noi-path-details{flex:1;overflow:auto}";

const PathDetails = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.segmentsTime = null;
  }
  async componentDidLoad() {
    const ids = selectPathSegmentsIds();
    try {
      const segmentsTime = await NoiAPI.getSegmentsAvgTime(ids, true);
      this.segmentsTime = segmentsTime.reduce((result, i) => { result[i.id] = i.timeSec; return result; }, {});
      this.highwayTime = Math.round(segmentsTime.reduce((result, i) => { result += i.timeSec; return result; }, 0) / 60);
    }
    catch (error) {
      alert('TODO: handle error');
    }
  }
  render() {
    const hostClass = {};
    const stations = selectPathStations();
    const startPos = stations[0].position;
    return (h(Host, { class: hostClass }, h("header", null, h("div", { class: "header__highway" }, h("span", { class: "header-highway__title" }, "A22"), " ", this.highwayTime, " min"), h("div", { class: "header__urban" })), h("div", { class: "content" }, stations.map(s => h("noi-station-item", { name: s.name, position: Math.abs(startPos - s.position) })))));
  }
};
PathDetails.style = pathDetailsCss;

export { PathDetails as noi_path_details };
