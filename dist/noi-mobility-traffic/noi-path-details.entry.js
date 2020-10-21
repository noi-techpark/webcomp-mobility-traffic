import { r as registerInstance, j as createEvent, h, e as Host } from './index-375c0366.js';
import { N as NoiAPI, f as formatDuration, u as urbanPathState } from './path-store-90ebdc75.js';
import './leaflet-src-ee2a66f1.js';
import { f as selectPathSegmentsIds, g as selectPathStations } from './index-460f7ef6.js';

const pathDetailsCss = ".sc-noi-path-details-h{display:flex;flex-direction:column}header.sc-noi-path-details{display:flex;width:100%;height:48px;line-height:48px;margin-bottom:auto;text-align:center}noi-button.header__section.sc-noi-path-details{flex:1;justify-content:center;--background:rgba(var(--noi-primary-rgb), 0.3);--color:var(--noi-primary-contrast);font-weight:bold;text-shadow:1px 1px rgb(0,0,0,0.3)}noi-button.header__section--active.sc-noi-path-details{--background:rgba(var(--noi-primary-rgb), 0.5)}.content.sc-noi-path-details{flex:1;overflow-y:auto;overflow-x:hidden}.header-highway__title.sc-noi-path-details{background:var(--noi-primary-contrast);color:var(--noi-primary);border-radius:4px;padding:4px;margin-right:8px;font-weight:normal;text-shadow:none}noi-station-item.sc-noi-path-details:last-of-type{margin-bottom:48px}";

const PathDetails = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.toggleActive = createEvent(this, "toggleActive", 7);
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
      alert('TODO: handle error');
    }
  }
  onActivatePath(value) {
    this.toggleActive.emit();
    this.activePath = value;
  }
  render() {
    const hostClass = {};
    const stations = selectPathStations();
    const startPos = stations[0].position;
    const highwayHeaderClass = {
      'header__section': true,
      'header__section--active': this.activePath === 'highway'
    };
    const urbanHeaderClass = {
      'header__section': true,
      'header__section--active': this.activePath === 'urban'
    };
    return (h(Host, { class: hostClass }, h("header", null, this.highwayTimeMin ?
      h("noi-button", { class: highwayHeaderClass, onClick: this.onActivatePath.bind(this, 'highway') }, h("p", null, h("span", { class: "header-highway__title" }, "A22"), " ", formatDuration(this.highwayTimeMin)))
      : null, urbanPathState.distance !== undefined ?
      h("noi-button", { class: urbanHeaderClass, onClick: this.onActivatePath.bind(this, 'urban') }, h("span", { class: "header-highway__title" }, "SS"), " ", urbanPathState.distance)
      : null), h("div", { class: "content" }, stations.map(s => h("noi-station-item", { name: s.name, position: Math.abs(startPos - s.position), isStart: !!s.isStart, isEnd: !!s.isEnd })))));
  }
  static get watchers() { return {
    "startId": ["updateStart"],
    "endId": ["updateStop"]
  }; }
};
PathDetails.style = pathDetailsCss;

export { PathDetails as noi_path_details };
