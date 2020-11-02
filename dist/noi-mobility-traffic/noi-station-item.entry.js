import { r as registerInstance, h, k as Host } from './index-54a7bd8b.js';

const stationItemCss = ".sc-noi-station-item-h{width:100%;overflow:hidden;position:relative;height:48px;margin:0 16px;background:transparent;font-family:var(--noi-font-family);color:rgba(var(--noi-primary-rgb), 0.7);display:flex;flex-direction:row;align-items:center}h3.sc-noi-station-item{font-family:var(--noi-font-family);margin-left:8px}.station-item--start.sc-noi-station-item-h h3.sc-noi-station-item{color:var(--noi-primary)}.station-item--end.sc-noi-station-item-h h3.sc-noi-station-item{color:var(--noi-action)}svg.sc-noi-station-item{margin:0 16px;fill:var(--noi-primary-contrast);stroke-width:4px;stroke:rgba(var(--noi-primary-rgb), 0.7)}.station-item--start.sc-noi-station-item-h svg.sc-noi-station-item{color:var(--noi-primary)}.station-item--end.sc-noi-station-item-h svg.sc-noi-station-item{color:var(--noi-action)}";

const StationItem = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.isStart = false;
    this.isEnd = false;
  }
  render() {
    const hostClass = {
      'station-item--end': this.isEnd,
      'station-item--start': this.isStart,
    };
    return (h(Host, { class: hostClass }, h("svg", { height: "20", viewBox: "-4 0 20 24", width: "14", xmlns: "http://www.w3.org/2000/svg" }, h("path", { d: "m7 0c3.8659932 0 7 3.13400675 7 7 0 2.57732883-2.3333333 6.9106622-7 13l-.60839506-.8015058c-4.26106996-5.6695486-6.39160494-9.73571332-6.39160494-12.1984942 0-3.86599325 3.13400675-7 7-7z" })), h("h3", null, this.name), "\u00A0", this.position ? h("p", null, (this.position / 1000).toFixed(1), " km") : null));
  }
};
StationItem.style = stationItemCss;

export { StationItem as noi_station_item };
