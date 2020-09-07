import { attachShadow, h, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath } from '@stencil/core/internal/client';

const globalScripts = () => {};

function format(first, middle, last) {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}

const noiMobilityTrafficCss = ":host{display:block}";

const NoiMobilityTraffic = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  getText() {
    return format(this.first, this.middle, this.last);
  }
  render() {
    return h("div", null, "Hello, World! I'm ", this.getText());
  }
  static get style() { return noiMobilityTrafficCss; }
};

globalScripts();
const NoiMobilityTraffic$1 = /*@__PURE__*/proxyCustomElement(NoiMobilityTraffic, [1,"noi-mobility-traffic",{"first":[1],"middle":[1],"last":[1]}]);
const defineCustomElements = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      NoiMobilityTraffic$1
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};

export { NoiMobilityTraffic$1 as NoiMobilityTraffic, defineCustomElements };
