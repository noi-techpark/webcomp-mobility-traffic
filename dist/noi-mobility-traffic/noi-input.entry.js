import { r as registerInstance, k as createEvent, l as Build, h, e as Host, f as getElement } from './index-5dc3e2b7.js';
import { d as debounceEvent, f as findItemLabel } from './helpers-2d19950a.js';

const inputCss = ".sc-noi-input-h{--clear-icon-bg-size:22px;--clear-icon-width:30px;--clear-icon-height:30px;--clear-icon-svg:\"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><polygon fill='#eee' points='405,136.798 375.202,107 256,226.202 136.798,107 107,136.798 226.202,256 107,375.202 136.798,405 256,285.798 375.202,405 405,375.202 285.798,256'/></svg>\";--placeholder-color:initial;--placeholder-font-style:initial;--placeholder-font-weight:initial;--placeholder-opacity:.5;--padding-top:10px;--padding-end:0;--padding-bottom:10px;--padding-start:calc(var(--noi-item-padding-start, 16px) / 2);--background:transparent;--color:initial;font-size:inherit;display:flex;position:relative;flex:1;align-items:center;width:100%;padding:0 !important;background:var(--background);border-radius:var(--border-radius, 0);color:var(--color);font-family:var(--noi-font-family);z-index:2}noi-item.sc-noi-input-h:not(.item-label),noi-item:not(.item-label) .sc-noi-input-h{--padding-start:0}.noi-input__native.sc-noi-input{padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;display:inline-block;flex:1;width:100%;max-width:100%;max-height:100%;border:0;outline:none;background:transparent;box-sizing:border-box;appearance:none}@supports (margin-inline-start: 0) or (-webkit-margin-start: 0){.noi-input__native.sc-noi-input{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}.noi-input__native.sc-noi-input::placeholder{color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.noi-input__native.sc-noi-input:-webkit-autofill{background-color:transparent}.noi-input__native.sc-noi-input:invalid{box-shadow:none}.noi-input__native.sc-noi-input::-ms-clear{display:none}.native-input[disabled].sc-noi-input{opacity:0.4}.cloned-input.sc-noi-input{left:0;top:0;position:absolute;pointer-events:none}.input-clear-icon.sc-noi-input{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;background-position:center;border:0;outline:none;background-color:transparent;background-repeat:no-repeat;visibility:hidden;appearance:none}.input-clear-icon.sc-noi-input:focus{opacity:0.5}.has-value.sc-noi-input-h .input-clear-icon.sc-noi-input{visibility:visible}.has-focus.sc-noi-input-h{pointer-events:none}.has-focus.sc-noi-input-h input.sc-noi-input,.has-focus.sc-noi-input-h a.sc-noi-input,.has-focus.sc-noi-input-h button.sc-noi-input{pointer-events:auto}.item-label-stacked.sc-noi-input-h,.item-label-stacked .sc-noi-input-h,.item-label-floating.sc-noi-input-h,.item-label-floating .sc-noi-input-h{--padding-top:8px;--padding-bottom:8px;--padding-start:0}.input-clear-icon.sc-noi-input{background-image:url(\"data:image/svg+xml;charset=utf-8,url-encode(var(--clear-icon-svg))\");width:var(--clear-icon-width);height:var(--clear-icon-height);background-size:var(--clear-icon-bg-size)}";

function getChangeEventValueDetails(value) {
  if (value === null) {
    return { value: null };
  }
  if (value === undefined) {
    return { value: undefined };
  }
  if (typeof value === 'number') {
    return { value: value + '' };
  }
  return { value: value.toString() };
}
const Input = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.noiInput = createEvent(this, "noiInput", 7);
    this.noiChange = createEvent(this, "noiChange", 7);
    this.noiBlur = createEvent(this, "noiBlur", 7);
    this.noiFocus = createEvent(this, "noiFocus", 7);
    this.noiStyle = createEvent(this, "noiStyle", 7);
    this.inputId = `noi-input-${inputIds++}`;
    /**
     * This is required for a WebKit bug which requires us to
     * blur and focus an input to properly focus the input in
     * an item with delegatesFocus. It will no longer be needed
     * with iOS 14.
     *
     * @internal
     */
    this.fireFocusEvents = true;
    this.hasFocus = false;
    /**
     * This Boolean attribute lets you specify that a form control should have input focus when the page loads.
     */
    this.autofocus = false;
    /**
     * If `true`, a clear icon will appear in the input when there is a value. Clicking it clears the input.
     */
    this.clearInput = false;
    /**
     * Set the amount of time, in milliseconds, to wait to trigger the `noiChange` event after each keystroke.
     */
    this.debounce = 0;
    /**
     * If `true`, the user cannot interact with the input.
     */
    this.disabled = false;
    /**
     * The name of the control, which is submitted with the form data.
     */
    this.name = this.inputId;
    /**
     * If `true`, the user cannot modify the value.
     */
    this.readonly = false;
    /**
     * If `true`, the user must fill in a value before submitting a form.
     */
    this.required = false;
    /**
     * The type of control to display. The default type is text.
     */
    this.type = 'text';
    /**
     * The value of the input.
     */
    this.value = '';
    this.onInput = (ev) => {
      const input = ev.target;
      if (input) {
        this.value = input.value || '';
      }
      this.noiInput.emit(ev);
    };
    this.onBlur = (ev) => {
      this.hasFocus = false;
      this.emitStyle();
      if (this.fireFocusEvents) {
        this.noiBlur.emit(ev);
      }
    };
    this.onFocus = (ev) => {
      this.hasFocus = true;
      this.emitStyle();
      if (this.fireFocusEvents) {
        this.noiFocus.emit(ev);
      }
    };
    this.clearTextOnEnter = (ev) => {
      if (ev.key === 'Enter') {
        this.clearTextInput(ev);
      }
    };
    this.clearTextInput = (ev) => {
      if (this.clearInput && !this.readonly && !this.disabled && ev) {
        ev.preventDefault();
        ev.stopPropagation();
        // Attempt to focus input again after pressing clear button
        this.setFocus();
      }
      this.value = '';
      /**
       * This is needed for clearOnEdit
       * Otherwise the value will not be cleared
       * if user is inside the input
       */
      if (this.nativeInput) {
        this.nativeInput.value = '';
      }
    };
  }
  debounceChanged() {
    this.noiChange = debounceEvent(this.noiChange, this.debounce);
  }
  disabledChanged() {
    this.emitStyle();
  }
  /**
   * Update the native input element when the value changes
   */
  valueChanged() {
    this.emitStyle();
    this.noiChange.emit(getChangeEventValueDetails(this.value));
  }
  componentWillLoad() {
    // If the ion-input has a tabindex attribute we get the value
    // and pass it down to the native input, then remove it from the
    // ion-input to avoid causing tabbing twice on the same element
    if (this.el.hasAttribute('tabindex')) {
      const tabindex = this.el.getAttribute('tabindex');
      this.tabindex = tabindex !== null ? tabindex : undefined;
      this.el.removeAttribute('tabindex');
    }
  }
  connectedCallback() {
    this.emitStyle();
    this.debounceChanged();
    if (Build.isBrowser) {
      document.dispatchEvent(new CustomEvent('ionInputDidLoad', {
        detail: this.el
      }));
    }
  }
  disconnectedCallback() {
    if (Build.isBrowser) {
      document.dispatchEvent(new CustomEvent('ionInputDidUnload', {
        detail: this.el
      }));
    }
  }
  /**
   * Sets focus on the native `input` in `ion-input`. Use this method instead of the global
   * `input.focus()`.
   */
  async setFocus() {
    if (this.nativeInput) {
      this.nativeInput.focus();
    }
  }
  /**
   * Sets blur on the native `input` in `ion-input`. Use this method instead of the global
   * `input.blur()`.
   * @internal
   */
  async setBlur() {
    if (this.nativeInput) {
      this.nativeInput.blur();
    }
  }
  /**
   * Returns the native `<input>` element used under the hood.
   */
  getInputElement() {
    return Promise.resolve(this.nativeInput);
  }
  getValue() {
    return typeof this.value === 'number' ? this.value.toString() :
      (this.value || '').toString();
  }
  emitStyle() {
    this.noiStyle.emit({
      'interactive': true,
      'input': true,
      'has-placeholder': this.placeholder != null,
      'has-value': this.hasValue(),
      'has-focus': this.hasFocus,
      'interactive-disabled': this.disabled,
    });
  }
  hasValue() {
    return this.getValue().length > 0;
  }
  render() {
    const value = this.getValue();
    const labelId = this.inputId + '-lbl';
    const label = findItemLabel(this.el);
    if (label) {
      label.id = labelId;
    }
    const hostClass = {
      'has-value': this.hasValue(),
      'has-focus': this.hasFocus
    };
    return (h(Host, { "aria-disabled": this.disabled ? 'true' : null, class: hostClass }, h("input", { class: "noi-input__native", ref: input => this.nativeInput = input, "aria-labelledby": labelId, disabled: this.disabled, autoFocus: this.autofocus, enterKeyHint: this.enterkeyhint, inputMode: this.inputmode, min: this.min, max: this.max, minLength: this.minlength, maxLength: this.maxlength, multiple: this.multiple, name: this.name, pattern: this.pattern, placeholder: this.placeholder || '', readOnly: this.readonly, required: this.required, step: this.step, size: this.size, tabindex: this.tabindex, type: this.type, value: value, onInput: this.onInput, onBlur: this.onBlur, onFocus: this.onFocus }), (this.clearInput && !this.readonly && !this.disabled) && h("button", { "aria-label": "reset", type: "button", class: "input-clear-icon", onTouchStart: this.clearTextInput, onMouseDown: this.clearTextInput, onKeyDown: this.clearTextOnEnter })));
  }
  get el() { return getElement(this); }
  static get watchers() { return {
    "debounce": ["debounceChanged"],
    "disabled": ["disabledChanged"],
    "value": ["valueChanged"]
  }; }
};
let inputIds = 0;
Input.style = inputCss;

export { Input as noi_input };
