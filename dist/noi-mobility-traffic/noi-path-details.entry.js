import { r as registerInstance, h, e as Host } from './index-375c0366.js';
import { N as NoiAPI } from './index-942666ae.js';
import { e as selectPathSegmentsIds, f as selectPathStations } from './index-2a350c08.js';

const pathDetailsCss = ".sc-noi-path-details-h{display:flex;flex-direction:column}header.sc-noi-path-details{background:rgba(var(--noi-primary-rgb), 0.5);display:flex;width:100%;height:48px;line-height:48px;margin-bottom:auto;text-align:center}.header__section.sc-noi-path-details{font-family:var(--noi-font-family);flex:1;justify-content:center;color:var(--noi-primary-contrast);font-weight:bold;text-shadow:1px 1px rgb(0,0,0,0.3)}.content.sc-noi-path-details{flex:1;overflow-y:auto;overflow-x:hidden}.header-highway__title.sc-noi-path-details{background:var(--noi-primary-contrast);color:var(--noi-primary);border-radius:4px;padding:4px;margin-right:8px;font-weight:normal;text-shadow:none}";

function formatDuration(valueMin) {
  const h = Math.floor(valueMin / 60);
  const min = (valueMin % 60);
  return h ? `${h} h ${min} min` : `${min} min`;
}
const PathDetails = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.segmentsTime = null;
    this.highwayTimeMin = undefined;
    this.urbanTimeMin = undefined;
  }
  async componentDidLoad() {
    const ids = selectPathSegmentsIds();
    try {
      const segmentsTime = await NoiAPI.getSegmentsAvgTime(ids, true);
      this.segmentsTime = segmentsTime.reduce((result, i) => { result[i.id] = i.timeSec; return result; }, {});
      this.highwayTimeMin = Math.round(segmentsTime.reduce((result, i) => { result += i.timeSec; return result; }, 0) / 60);
    }
    catch (error) {
      alert('TODO: handle error');
    }
  }
  render() {
    const hostClass = {};
    const stations = selectPathStations();
    const startPos = stations[0].position;
    return (h(Host, { class: hostClass }, h("header", null, this.highwayTimeMin ?
      h("div", { class: "header__section" }, h("span", { class: "header-highway__title" }, "A22"), " ", formatDuration(this.highwayTimeMin))
      : null, this.urbanTimeMin ?
      h("div", { class: "header__section" })
      : null), h("div", { class: "content" }, stations.map(s => h("noi-station-item", { name: s.name, position: Math.abs(startPos - s.position) })))));
  }
};
PathDetails.style = pathDetailsCss;

export { PathDetails as noi_path_details };
