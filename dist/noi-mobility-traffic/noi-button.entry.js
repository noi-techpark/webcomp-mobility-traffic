import { r as registerInstance, i as createEvent, h, j as Host, g as getElement } from './index-bd60623e.js';
import { h as hasShadowDom } from './helpers-2d19950a.js';

const buttonCss = ":host(.button-md){--border-radius:4px;--padding-top:0;--padding-bottom:0;--padding-start:1.1em;--padding-end:1.1em;--transition:box-shadow 100ms cubic-bezier(.4, 0, .2, 1),\n                background-color 15ms linear,\n                color 15ms linear;margin-left:2px;margin-right:2px;margin-top:4px;margin-bottom:4px;height:36px;font-size:14px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase}@supports (margin-inline-start: 0) or (-webkit-margin-start: 0){:host(.button-md){margin-left:unset;margin-right:unset;-webkit-margin-start:2px;margin-inline-start:2px;-webkit-margin-end:2px;margin-inline-end:2px}}:host(.button-md.button-solid){--background-activated:transparent;--background-hover:#333;--background-focused:#333;--background-activated-opacity:0;--background-focused-opacity:.24;--background-hover-opacity:.08;--box-shadow:0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12)}:host(.button-md.button-solid.noi-activated){--box-shadow:0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12)}:host(.button-md.button-outline){--border-width:2px;--border-style:solid;--box-shadow:none;--background-activated:transparent;--background-focused:#999;--background-hover:#999;--background-activated-opacity:0;--background-focused-opacity:.12;--background-hover-opacity:.04}:host(.button-md.button-outline.noi-activated) .noi-button__native{background:transparent}:host(.button-md.button-clear){--background-activated:transparent;--background-focused:#999;--background-hover:#999;--background-activated-opacity:0;--background-focused-opacity:.12;--background-hover-opacity:.04}:host(.button-md.button-round){--border-radius:64px;--padding-top:0;--padding-start:26px;--padding-end:26px;--padding-bottom:0}:host(.button-md.button-large){--padding-top:0;--padding-start:0;--padding-end:1em;--padding-bottom:0;height:2.8em;font-size:20px}:host(.button-md.button-small){--padding-top:0;--padding-start:.9em;--padding-end:.9em;--padding-bottom:0;height:2.1em;font-size:13px}:host(.button-md.button-strong){font-weight:bold}::slotted(noi-icon[slot=icon-only]){padding-left:0;padding-right:0;padding-top:0;padding-bottom:0}:host{--overflow:hidden;--ripple-color:currentColor;--border-width:initial;--border-color:initial;--border-style:initial;--color-activated:var(--color);--color-focused:var(--color);--color-hover:var(--color);--box-shadow:none;display:inline-block;width:auto;color:var(--color);font-family:var(--noi-font-family);text-align:center;text-decoration:none;text-overflow:ellipsis;white-space:nowrap;user-select:none;vertical-align:top;vertical-align:-webkit-baseline-middle;pointer-events:auto;font-kerning:none}:host(.button-disabled){cursor:default;opacity:0.5;pointer-events:none}::slotted(*) .button-has-icon-only.button-clear{--padding-top:12px;--padding-end:12px;--padding-bottom:12px;--padding-start:12px;margin:0;width:48px;height:48px;--background:transparent}:host(.button-solid){--background:#fff;--color:#333}:host(.button-outline){--border-color:#333;--background:transparent;--color:#333}:host(.button-clear){--border-width:0;--background:transparent;--color:#333}:host(.button-block){display:block}:host(.button-block) .noi-button__native{margin-left:0;margin-right:0;display:block;width:100%;clear:both;contain:content}:host(.button-block) .noi-button__native::after{clear:both}:host(.button-full){display:block}:host(.button-full) .noi-button__native{margin-left:0;margin-right:0;display:block;width:100%;contain:content}:host(.button-full:not(.button-round)) .noi-button__native{border-radius:0;border-right-width:0;border-left-width:0}.noi-button__native{border-radius:var(--border-radius);-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;display:block;position:relative;width:100%;height:100%;transition:var(--transition);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);outline:none;background:var(--background);line-height:1;box-shadow:var(--box-shadow);contain:layout style;cursor:pointer;opacity:var(--opacity);overflow:var(--overflow);z-index:0;box-sizing:border-box;appearance:none}@supports (margin-inline-start: 0) or (-webkit-margin-start: 0){.noi-button__native{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}.noi-button__native::-moz-focus-inner{border:0}.noi-button__inner{display:flex;position:relative;flex-flow:row nowrap;flex-shrink:0;align-items:center;justify-content:center;width:100%;height:100%;z-index:1}.noi-button__native::after{left:0;right:0;top:0;bottom:0;position:absolute;content:\"\";opacity:0}:host(.noi-activated){color:var(--color-activated)}:host(.noi-activated) .noi-button__native::after{background:var(--background-activated);opacity:var(--background-activated-opacity)}:host(.noi-focused){color:var(--color-focused)}:host(.noi-focused) .noi-button__native::after{background:var(--background-focused);opacity:var(--background-focused-opacity)}@media (any-hover: hover){:host(:hover){color:var(--color-hover)}:host(:hover) .noi-button__native::after{background:var(--background-hover);opacity:var(--background-hover-opacity)}}";

const Button = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.noiFocus = createEvent(this, "noiFocus", 7);
    this.noiBlur = createEvent(this, "noiBlur", 7);
    this.inItem = false;
    /**
     * If `true`, the user cannot interact with the button.
     */
    this.disabled = false;
    /**
     * If `true`, activates a button with a heavier font weight.
     */
    this.strong = false;
    /**
     * The type of the button.
     */
    this.type = 'button';
    this.handleClick = (ev) => {
      if (this.type === 'button' && this.href) {
        window.location.href = this.href;
        return;
      }
      if (hasShadowDom(this.el)) {
        // this button wants to specifically submit a form
        // climb up the dom to see if we're in a <form>
        // and if so, then use JS to submit it
        const form = this.el.closest('form');
        if (form) {
          ev.preventDefault();
          const fakeButton = document.createElement('button');
          fakeButton.type = this.type;
          fakeButton.style.display = 'none';
          form.appendChild(fakeButton);
          fakeButton.click();
          fakeButton.remove();
        }
        return;
      }
    };
    this.onFocus = () => {
      this.noiFocus.emit();
    };
    this.onBlur = () => {
      this.noiBlur.emit();
    };
  }
  componentWillLoad() {
    this.inItem = !!this.el.closest('noi-item') || !!this.el.closest('noi-item-divider');
  }
  get hasIconOnly() {
    return !!this.el.querySelector('[slot="icon-only"]');
  }
  render() {
    const { type, disabled, rel, target, size, href, expand, hasIconOnly, shape, strong } = this;
    const finalSize = size === undefined && this.inItem ? 'small' : size;
    const TagType = href === undefined ? 'button' : 'a';
    const attrs = (TagType === 'button')
      ? { type }
      : {
        download: this.download,
        href,
        rel,
        target
      };
    let fill = this.fill;
    if (fill === undefined) {
      fill = 'solid';
    }
    const hostClass = {
      'button': true,
      [`button-${expand}`]: expand !== undefined,
      [`button-${finalSize}`]: finalSize !== undefined,
      [`button-${shape}`]: shape !== undefined,
      [`button-${fill}`]: true,
      [`button-strong`]: strong,
      'button-has-icon-only': hasIconOnly,
      'button-disabled': disabled,
      'noi-activatable': true,
      'noi-focusable': true,
    };
    return (h(Host, { onClick: this.handleClick, "aria-disabled": disabled ? 'true' : null, class: hostClass }, h(TagType, Object.assign({}, attrs, { class: "noi-button__native", part: "native", disabled: disabled, onFocus: this.onFocus, onBlur: this.onBlur }), h("span", { class: "noi-button__inner" }, h("slot", { name: "icon-only" }), h("slot", { name: "start" }), h("slot", null), h("slot", { name: "end" })))));
  }
  get el() { return getElement(this); }
};
Button.style = buttonCss;

export { Button as noi_button };
