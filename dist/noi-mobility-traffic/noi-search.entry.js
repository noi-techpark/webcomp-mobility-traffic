import { r as registerInstance, h, j as Host } from './index-bd60623e.js';
import { s as state } from './index-0093c7e4.js';

const searchCss = ".sc-noi-search-h{display:flex;flex-direction:row;align-items:center}.noi-search__inputs.sc-noi-search{padding:8px;min-width:100px;flex:1}.noi-search__button.sc-noi-search{margin-left:auto;min-width:40px;display:flex;align-items:center;justify-content:center}.noi-search__input.sc-noi-search{--background:#eee;--border-radius:10px;--color:#333;margin:8px;display:block;margin-right:12px;--transition:box-shadow 200ms cubic-bezier(.4, 0, .2, 1),\n                background-color 15ms linear,\n                color 15ms linear;--box-shadow:none;--padding-top:12px;--padding-right:8px;--padding-bottom:12px;--padding-left:8px;--border-radius:4px;--background-activated:#eee;--background-activated-opacity:0.5}.noi-search__input.noi-activated.sc-noi-search{--box-shadow:0px 0px 0px 2px #eee}.noi-search__input--empty.sc-noi-search{--background:#ccc}";

const Search = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  getStart() {
    // TODO: get placeholder from strings
    return state.start ? state.start.name : 'Partenza?';
  }
  getEnd() {
    // TODO: get placeholder from strings
    return state.end ? state.end.name : 'Destinazione?';
  }
  onInputClick(what) {
    state.selecting = what;
  }
  render() {
    // TODO: add inputs class for color (placeholder/value)
    return (h(Host, null, h("div", { class: "noi-search__inputs" }, h("noi-button", { class: "noi-search__input", onClick: this.onInputClick.bind(this, 'start') }, this.getStart()), h("noi-button", { class: "noi-search__input", onClick: this.onInputClick.bind(this, 'end') }, this.getEnd()))));
  }
};
Search.style = searchCss;

export { Search as noi_search };
