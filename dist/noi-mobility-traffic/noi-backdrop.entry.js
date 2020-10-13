import { r as registerInstance, i as createEvent, h, j as Host } from './index-70bc2936.js';

const backdropCss = ":host{display:block;position:absolute;top:0;left:0;right:0;bottom:0;transform:translateZ(0);contain:strict;cursor:pointer;touch-action:none;background-color:var(--background, #1b2b34);transition:opacity 0.5s ease-in-out;opacity:var(--opacity, 0.5)}:host(.backdrop-hide){background:transparent;opacity:.1}:host(.backdrop-no-tappable){cursor:auto}";

const Backdrop = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.noiBackdropTap = createEvent(this, "noiBackdropTap", 7);
    this.overlayIndex = 1;
    this.visible = true;
    this.tappable = true;
    this.stopPropagation = true;
  }
  onMouseDown(ev) {
    this.emitTap(ev);
  }
  emitTap(ev) {
    if (this.stopPropagation) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    if (this.tappable) {
      this.noiBackdropTap.emit();
    }
  }
  render() {
    const hostClass = {
      'backdrop-hide': !this.visible,
      'backdrop-no-tappable': !this.tappable,
    };
    const hostStyle = {
      zIndex: `${this.visible ? this.overlayIndex : -1}`
    };
    return (h(Host, { tabindex: "-1", class: hostClass, style: hostStyle }));
  }
};
Backdrop.style = backdropCss;

export { Backdrop as noi_backdrop };
