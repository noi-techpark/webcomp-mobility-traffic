import { r as registerInstance, h, i as Host } from './index-aee307c3.js';

const cardCss = ":host{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;margin-left:10px;margin-right:10px;margin-top:10px;margin-bottom:10px;border-radius:4px;display:block;position:relative;background:var(--background, #fff);font-family:var(--noi-font-family);overflow:hidden;font-size:14px;box-shadow:0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)}@supports (margin-inline-start: 0) or (-webkit-margin-start: 0){:host{margin-left:unset;margin-right:unset;-webkit-margin-start:10px;margin-inline-start:10px;-webkit-margin-end:10px;margin-inline-end:10px}}.noi-card__native{font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;display:block;width:100%;min-height:var(--min-height);transition:var(--transition);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);outline:none;background:inherit}.card-native::-moz-focus-inner{border:0}button,a{cursor:pointer;user-select:none;-webkit-user-drag:none}";

const Card = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("div", { class: "noi-card__native", part: "native" }, h("slot", null))));
  }
};
Card.style = cardCss;

export { Card as noi_card };
