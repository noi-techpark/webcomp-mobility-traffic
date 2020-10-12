import { r as registerInstance, h, i as Host, j as getAssetPath } from './index-733fc348.js';
import { s as state } from './index-aa360443.js';

const searchCss = ".sc-noi-search-h{display:flex;flex-direction:row;align-items:center}.noi-search__img.sc-noi-search{margin-right:auto;width:20px;height:20px;position:relative;border-right:1px solid #444}.noi-search__img.sc-noi-search:before{position:absolute;content:'';left:calc(100% - 5px);top:-13px;width:8px;height:8px;border-radius:4px;border:1px solid #444}.noi-search__img.sc-noi-search:after{position:absolute;content:'';left:calc(100% - 5px);top:calc(100% + 4px);width:8px;height:8px;border-radius:4px;border:1px solid #444;background-color:#444}.noi-search__inputs.sc-noi-search{padding:8px;min-width:100px;flex:1}.noi-search__button.sc-noi-search{margin-left:auto;min-width:40px;display:flex;align-items:center;justify-content:center}hr.sc-noi-search{margin:10px 12px;border:1px solid #eee}noi-input.sc-noi-search{--background:#eee;--border-radius:10px;--color:#333;margin:8px;width:auto}noi-input.has-value.sc-noi-search{--background:#ccc}noi-button.sc-noi-search{width:100%;display:block;margin-right:12px;--transition:box-shadow 200ms cubic-bezier(.4, 0, .2, 1),\n                background-color 15ms linear,\n                color 15ms linear;--box-shadow:none;--padding-top:12px;--padding-right:8px;--padding-bottom:12px;--padding-left:8px;--border-radius:4px;--background-activated:#eee;--background-activated-opacity:0.5}noi-button.noi-activated.sc-noi-search{--box-shadow:0px 0px 0px 2px #eee}";

const Search = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  getStart() {
    return state.start ? state.start.name : '';
  }
  getEnd() {
    return state.end ? state.end.name : '';
  }
  render() {
    return (h(Host, null, h("div", { class: "noi-search__img" }), h("div", { class: "noi-search__inputs" }, h("noi-input", { placeholder: "Partenza?", value: this.getStart() }), h("hr", null), h("noi-input", { placeholder: "Destinazione?", value: this.getEnd() })), h("div", { class: "noi-search__button" }, h("noi-button", { fill: "solid" }, h("img", { slot: "icon-only", src: getAssetPath(`./assets/reorder.svg`) })))));
  }
};
Search.style = searchCss;

export { Search as noi_search };
