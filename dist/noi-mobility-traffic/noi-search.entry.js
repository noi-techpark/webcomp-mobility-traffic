import { r as registerInstance, h, e as Host } from './index-e280071f.js';

const searchCss = ".sc-noi-search-h{display:flex;flex-direction:row}.noi-search__img.sc-noi-search{margin-left:auto}.noi-search__inputs.sc-noi-search{padding:8px;min-width:100px;flex:1}.noi-search__button.sc-noi-search{margin-left:auto;min-width:40px;display:flex;align-items:center;justify-content:center}noi-input.sc-noi-search{--background:#eee;--border-radius:8px;margin:8px;width:auto}";

const Search = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("div", { class: "noi-search__img" }), h("div", { class: "noi-search__inputs" }, h("noi-input", { placeholder: "Partenza?" }), h("noi-input", { placeholder: "Destinazione?" })), h("div", { class: "noi-search__button" }, h("noi-button", { class: "button-md", fill: "solid", shape: "round" }))));
  }
};
Search.style = searchCss;

export { Search as noi_search };
