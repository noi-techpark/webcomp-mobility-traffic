import { r as registerInstance, k as createEvent, h, e as Host } from './index-5dc3e2b7.js';
import './index-ba94aa95.js';
import { t as translate, s as state, d as selectStationsWithSelected } from './locale-8acd63dc.js';
import './index-b8f2ed21.js';

const stationsModalCss = ".sc-noi-stations-modal-h{position:absolute;display:block;top:0;bottom:0;left:0;width:100%;background:var(--background, #fff);transform:translateX(-100%);-webkit-transform:translateX(-100%);will-change:transform}.noi-media-gs.sc-noi-stations-modal-h{width:100%;max-width:360px}.noi-media-gs--landscape.sc-noi-stations-modal-h{width:360px}.slide-in.sc-noi-stations-modal-h{animation:slide-in 0.4s forwards;-webkit-animation:slide-in 0.4s forwards}.slide-out.sc-noi-stations-modal-h{animation:slide-out 0.3s forwards;-webkit-animation:slide-out 0.3s forwards}@keyframes slide-in{100%{transform:translateX(0%)}}@-webkit-keyframes slide-in{100%{transform:translateX(0%)}}@keyframes slide-out{0%{transform:translateX(0%)}100%{transform:translateX(-100%)}}@-webkit-keyframes slide-out{0%{-webkit-transform:translateX(0%)}100%{-webkit-transform:translateX(-100%)}}.wrapper.sc-noi-stations-modal{height:100%;width:100%;display:flex;flex-direction:column}header.sc-noi-stations-modal{background:var(--noi-primary);min-height:48px;display:flex;align-items:center;padding:0 16px}.header__icon.sc-noi-stations-modal{margin-left:auto;fill:var(--noi-primary-contrast)}.header__title.sc-noi-stations-modal{font-family:var(--noi-font-family);color:var(--noi-primary-contrast);font-size:16px;flex:1;text-align:center;text-transform:uppercase}.search.sc-noi-stations-modal{margin-bottom:auto}.list.sc-noi-stations-modal{flex:1;background:#ffffff;min-height:0;overflow:auto}.station.sc-noi-stations-modal{overflow:hidden;position:relative;height:48px;margin:0 16px;padding-right:8px;background:#ffffff;font-family:var(--noi-font-family);color:var(--noi-primary);display:flex;align-items:center}.station.sc-noi-stations-modal::before{content:' ';position:fixed;width:100%;height:100%;top:0;left:0;background-color:white;background-size:cover;will-change:transform;z-index:-1}.station--selected.sc-noi-stations-modal{background:rgba(var(--noi-primary-rgb), 0.8);color:var(--noi-primary-contrast)}.station--selected.sc-noi-stations-modal>.station__select-btn.sc-noi-stations-modal{display:block}.station__icon.sc-noi-stations-modal{margin:0 16px;fill:var(--noi-primary);stroke-width:2px;stroke:var(--noi-primary)}.station__select-btn.sc-noi-stations-modal{--background:var(--noi-action);--color:var(--noi-action-contrast);margin-left:auto;min-width:80px;display:none}.station--selected.sc-noi-stations-modal>.station__icon.sc-noi-stations-modal{fill:var(--noi-primary-contrast)}.station--end.sc-noi-stations-modal>.station__icon.sc-noi-stations-modal{fill:var(--noi-action);stroke:var(--noi-action)}.station--end.station--selected.sc-noi-stations-modal>.station__icon.sc-noi-stations-modal{fill:var(--noi-action-contrast)}noi-input.sc-noi-stations-modal{--background:#eee;--color:var(--noi-primary);margin:8px;width:auto}noi-input.has-value.sc-noi-stations-modal{--background:#ccc}";

const StationsModal = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.modalClose = createEvent(this, "modalClose", 7);
    this.visible = false;
    this.selecting = 'start';
    this.overlayIndex = 1;
    this.searchText = '';
  }
  onClose() {
    this.modalClose.emit();
    this.searchText = '';
  }
  getTitle() {
    return translate(`stations-modal.header-${this.selecting}`);
  }
  onSearchChange(value) {
    this.searchText = value ? value.detail.value.toLowerCase() : '';
  }
  stationSelectedToggle(id) {
    state.selectedId = id;
  }
  onSelectStation(id) {
    if (this.selecting === 'start') {
      state.startId = id;
    }
    if (this.selecting === 'end') {
      state.endId = id;
    }
  }
  renderStations() {
    if (!state.stationsList) {
      return null;
    }
    const notSelectedId = this.selecting === 'start' ? state.endId : state.startId;
    return selectStationsWithSelected()
      .filter(s => s.name.toLowerCase().includes(this.searchText) && s.id !== notSelectedId)
      .map(s => {
      const stationClass = {
        station: true,
        'station--selected': s.selected,
        'station--end': this.selecting === 'end'
      };
      return (h("article", { class: stationClass, onClick: this.stationSelectedToggle.bind(this, s.id) }, h("svg", { class: "station__icon", height: "20", viewBox: "-4 -4 20 24", width: "14", xmlns: "http://www.w3.org/2000/svg" }, h("path", { d: "m7 0c3.8659932 0 7 3.13400675 7 7 0 2.57732883-2.3333333 6.9106622-7 13l-.60839506-.8015058c-4.26106996-5.6695486-6.39160494-9.73571332-6.39160494-12.1984942 0-3.86599325 3.13400675-7 7-7z", "stroke-width": "2" })), s.name, h("noi-button", { size: "small", class: "station__select-btn button-md", onClick: this.onSelectStation.bind(this, s.id) }, translate('stations-modal.select-btn'))));
    });
  }
  render() {
    const hostClass = {
      'slide-in': this.visible,
      'slide-out': !this.visible
    };
    const hostStyle = {
      zIndex: `${this.overlayIndex + 1}`,
    };
    return (h(Host, { class: hostClass, style: hostStyle }, h("div", { class: "wrapper" }, h("header", null, h("noi-button", { fill: "clear", onClick: this.onClose.bind(this) }, h("svg", { slot: "icon-only", class: "header__icon", height: "14", viewBox: "0 0 10 14", width: "10", xmlns: "http://www.w3.org/2000/svg" }, h("path", { d: "m0 1.53073535 1.28718658-1.53073535 8.35973178 7.02965056-8.35973178 7.02965054-1.28718658-1.5307353 6.53859329-5.49919813z", transform: "matrix(-1 0 0 1 9.646918 0)" }))), h("span", { class: "header__title" }, this.getTitle())), h("div", { class: "search" }, h("noi-input", { debounce: 100, onNoiChange: this.onSearchChange.bind(this), placeholder: translate('stations-modal.input-placeholder') })), h("div", { class: "list" }, this.renderStations()))));
  }
  static get assetsDirs() { return ["../../assets"]; }
};
StationsModal.style = stationsModalCss;

export { StationsModal as noi_stations_modal };
