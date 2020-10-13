import { r as registerInstance, i as createEvent, h, j as Host, k as getAssetPath } from './index-70bc2936.js';
import { s as state } from './index-ff3a88a2.js';

const stationsModalCss = ".sc-noi-stations-modal-h{position:absolute;display:block;top:0;bottom:0;left:0;width:100%;background:var(--background, #fff);transform:translateX(-100%);-webkit-transform:translateX(-100%)}.noi-media-gs.sc-noi-stations-modal-h{width:100%;max-width:360px}.noi-media-gs--landscape.sc-noi-stations-modal-h{width:360px}.slide-in.sc-noi-stations-modal-h{animation:slide-in 0.4s forwards;-webkit-animation:slide-in 0.4s forwards}.slide-out.sc-noi-stations-modal-h{animation:slide-out 0.3s forwards;-webkit-animation:slide-out 0.3s forwards}@keyframes slide-in{100%{transform:translateX(0%)}}@-webkit-keyframes slide-in{100%{transform:translateX(0%)}}@keyframes slide-out{0%{transform:translateX(0%)}100%{transform:translateX(-100%)}}@-webkit-keyframes slide-out{0%{-webkit-transform:translateX(0%)}100%{-webkit-transform:translateX(-100%)}}.wrapper.sc-noi-stations-modal{height:100%;width:100%;display:flex;flex-direction:column}header.sc-noi-stations-modal{background:var(--noi-primary-color);min-height:48px;display:flex;align-items:center;padding:0 16px}.header__icon.sc-noi-stations-modal{margin-left:auto}.header__title.sc-noi-stations-modal{font-family:var(--noi-font-family);color:var(--noi-primary-contrast-color);font-size:16px;flex:1;text-align:center;text-transform:uppercase}.search.sc-noi-stations-modal{margin-bottom:auto}.list.sc-noi-stations-modal{flex:1;background:#ffffff;min-height:0;overflow:auto}.station.sc-noi-stations-modal{overflow:hidden;position:relative;height:48px;margin:8px 16px;background:#ffffff;font-family:var(--noi-font-family);color:var(--noi-primary)}.station.sc-noi-stations-modal::before{content:' ';position:fixed;width:100%;height:100%;top:0;left:0;background-color:white;background-size:cover;will-change:transform;z-index:-1}noi-input.sc-noi-stations-modal{--background:#eee;--color:var(--noi-primary);margin:8px;width:auto}noi-input.has-value.sc-noi-stations-modal{--background:#ccc}";

const StationsModal = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.modalClose = createEvent(this, "modalClose", 7);
    this.visible = false;
    this.selecting = 'start';
    this.overlayIndex = 1;
  }
  onClose() {
    this.modalClose.emit();
  }
  getTitle() {
    if (this.selecting === 'start') {
      return 'Selezionare la partenza';
    }
    if (this.selecting === 'end') {
      return 'Selezionare la destinazione';
    }
  }
  renderStations() {
    if (!state.stationsList) {
      return null;
    }
    return state.stationsList.map(s => {
      return (h("article", { class: "station" }, s.name));
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
    return (h(Host, { class: hostClass, style: hostStyle }, h("div", { class: "wrapper" }, h("header", null, h("noi-button", { fill: "clear", onClick: this.onClose.bind(this) }, h("img", { slot: "icon-only", class: "header__icon", src: getAssetPath('./assets/back.svg'), alt: "Indietro" })), h("span", { class: "header__title" }, this.getTitle())), h("div", { class: "search" }, h("noi-input", null)), h("div", { class: "list" }, this.renderStations()))));
  }
  static get assetsDirs() { return ["../../assets"]; }
};
StationsModal.style = stationsModalCss;

export { StationsModal as noi_stations_modal };
