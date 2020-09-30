import { r as registerInstance, l as h, m as Host } from './index-683b5499.js';
import { g as getIonMode } from './ionic-global-02d40d5a.js';
import { c as createColorClasses } from './theme-1706d6ff.js';

const textCss = ":host(.ion-color){color:var(--ion-color-base)}";

const Text = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    const mode = getIonMode(this);
    return (h(Host, { class: createColorClasses(this.color, {
        [mode]: true,
      }) }, h("slot", null)));
  }
};
Text.style = textCss;

export { Text as ion_text };
