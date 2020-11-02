import { Build, Component, Element, Event, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import { debounceEvent, findItemLabel } from '../helpers';
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
export class Input {
  constructor() {
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
    return (h(Host, { "aria-disabled": this.disabled ? 'true' : null, class: hostClass },
      h("input", { class: "noi-input__native", ref: input => this.nativeInput = input, "aria-labelledby": labelId, disabled: this.disabled, autoFocus: this.autofocus, enterKeyHint: this.enterkeyhint, inputMode: this.inputmode, min: this.min, max: this.max, minLength: this.minlength, maxLength: this.maxlength, multiple: this.multiple, name: this.name, pattern: this.pattern, placeholder: this.placeholder || '', readOnly: this.readonly, required: this.required, step: this.step, size: this.size, tabindex: this.tabindex, type: this.type, value: value, onInput: this.onInput, onBlur: this.onBlur, onFocus: this.onFocus }),
      (this.clearInput && !this.readonly && !this.disabled) && h("button", { "aria-label": "reset", type: "button", class: "input-clear-icon", onTouchStart: this.clearTextInput, onMouseDown: this.clearTextInput, onKeyDown: this.clearTextOnEnter })));
  }
  static get is() { return "noi-input"; }
  static get encapsulation() { return "scoped"; }
  static get originalStyleUrls() { return {
    "$": ["input.scss"]
  }; }
  static get styleUrls() { return {
    "$": ["input.css"]
  }; }
  static get properties() { return {
    "fireFocusEvents": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [{
            "text": undefined,
            "name": "internal"
          }],
        "text": "This is required for a WebKit bug which requires us to\nblur and focus an input to properly focus the input in\nan item with delegatesFocus. It will no longer be needed\nwith iOS 14."
      },
      "attribute": "fire-focus-events",
      "reflect": false,
      "defaultValue": "true"
    },
    "autofocus": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "This Boolean attribute lets you specify that a form control should have input focus when the page loads."
      },
      "attribute": "autofocus",
      "reflect": false,
      "defaultValue": "false"
    },
    "clearInput": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "If `true`, a clear icon will appear in the input when there is a value. Clicking it clears the input."
      },
      "attribute": "clear-input",
      "reflect": false,
      "defaultValue": "false"
    },
    "debounce": {
      "type": "number",
      "mutable": false,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Set the amount of time, in milliseconds, to wait to trigger the `noiChange` event after each keystroke."
      },
      "attribute": "debounce",
      "reflect": false,
      "defaultValue": "0"
    },
    "disabled": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "If `true`, the user cannot interact with the input."
      },
      "attribute": "disabled",
      "reflect": false,
      "defaultValue": "false"
    },
    "enterkeyhint": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'",
        "resolved": "\"done\" | \"enter\" | \"go\" | \"next\" | \"previous\" | \"search\" | \"send\"",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "A hint to the browser for which enter key to display.\nPossible values: `\"enter\"`, `\"done\"`, `\"go\"`, `\"next\"`,\n`\"previous\"`, `\"search\"`, and `\"send\"`."
      },
      "attribute": "enterkeyhint",
      "reflect": false
    },
    "inputmode": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "'none' | 'text' | 'search'",
        "resolved": "\"none\" | \"search\" | \"text\"",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "A hint to the browser for which keyboard to display.\nPossible values: `\"none\"`, `\"text\"`, `\"tel\"`, `\"url\"`,\n`\"email\"`, `\"numeric\"`, `\"decimal\"`, and `\"search\"`."
      },
      "attribute": "inputmode",
      "reflect": false
    },
    "max": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "The maximum value, which must not be less than its minimum (min attribute) value."
      },
      "attribute": "max",
      "reflect": false
    },
    "maxlength": {
      "type": "number",
      "mutable": false,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the maximum number of characters that the user can enter."
      },
      "attribute": "maxlength",
      "reflect": false
    },
    "min": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "The minimum value, which must not be greater than its maximum (max attribute) value."
      },
      "attribute": "min",
      "reflect": false
    },
    "minlength": {
      "type": "number",
      "mutable": false,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "If the value of the type attribute is `text`, `email`, `search`, `password`, `tel`, or `url`, this attribute specifies the minimum number of characters that the user can enter."
      },
      "attribute": "minlength",
      "reflect": false
    },
    "multiple": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "If `true`, the user can enter more than one value. This attribute applies when the type attribute is set to `\"email\"` or `\"file\"`, otherwise it is ignored."
      },
      "attribute": "multiple",
      "reflect": false
    },
    "name": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "The name of the control, which is submitted with the form data."
      },
      "attribute": "name",
      "reflect": false,
      "defaultValue": "this.inputId"
    },
    "pattern": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "A regular expression that the value is checked against. The pattern must match the entire value, not just some subset. Use the title attribute to describe the pattern to help the user. This attribute applies when the value of the type attribute is `\"text\"`, `\"search\"`, `\"tel\"`, `\"url\"`, `\"email\"`, `\"date\"`, or `\"password\"`, otherwise it is ignored. When the type attribute is `\"date\"`, `pattern` will only be used in browsers that do not support the `\"date\"` input type natively. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date for more information."
      },
      "attribute": "pattern",
      "reflect": false
    },
    "placeholder": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string | null",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "Instructional text that shows before the input has a value."
      },
      "attribute": "placeholder",
      "reflect": false
    },
    "readonly": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "If `true`, the user cannot modify the value."
      },
      "attribute": "readonly",
      "reflect": false,
      "defaultValue": "false"
    },
    "required": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "If `true`, the user must fill in a value before submitting a form."
      },
      "attribute": "required",
      "reflect": false,
      "defaultValue": "false"
    },
    "step": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "Works with the min and max attributes to limit the increments at which a value can be set.\nPossible values are: `\"any\"` or a positive floating point number."
      },
      "attribute": "step",
      "reflect": false
    },
    "size": {
      "type": "number",
      "mutable": false,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "The initial size of the control. This value is in pixels unless the value of the type attribute is `\"text\"` or `\"password\"`, in which case it is an integer number of characters. This attribute applies only when the `type` attribute is set to `\"text\"`, `\"search\"`, `\"tel\"`, `\"url\"`, `\"email\"`, or `\"password\"`, otherwise it is ignored."
      },
      "attribute": "size",
      "reflect": false
    },
    "type": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "TextFieldTypes",
        "resolved": "\"search\" | \"text\"",
        "references": {
          "TextFieldTypes": {
            "location": "local"
          }
        }
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "The type of control to display. The default type is text."
      },
      "attribute": "type",
      "reflect": false,
      "defaultValue": "'text'"
    },
    "value": {
      "type": "any",
      "mutable": true,
      "complexType": {
        "original": "string | number | null | undefined",
        "resolved": "number | string",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "The value of the input."
      },
      "attribute": "value",
      "reflect": false,
      "defaultValue": "''"
    }
  }; }
  static get states() { return {
    "hasFocus": {}
  }; }
  static get events() { return [{
      "method": "noiInput",
      "name": "noiInput",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Emitted when a keyboard input occurred."
      },
      "complexType": {
        "original": "KeyboardEvent",
        "resolved": "KeyboardEvent",
        "references": {
          "KeyboardEvent": {
            "location": "global"
          }
        }
      }
    }, {
      "method": "noiChange",
      "name": "noiChange",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Emitted when the value has changed."
      },
      "complexType": {
        "original": "InputChangeEventDetail",
        "resolved": "InputChangeEventDetail",
        "references": {
          "InputChangeEventDetail": {
            "location": "local"
          }
        }
      }
    }, {
      "method": "noiBlur",
      "name": "noiBlur",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Emitted when the input loses focus."
      },
      "complexType": {
        "original": "FocusEvent",
        "resolved": "FocusEvent",
        "references": {
          "FocusEvent": {
            "location": "global"
          }
        }
      }
    }, {
      "method": "noiFocus",
      "name": "noiFocus",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Emitted when the input has focus."
      },
      "complexType": {
        "original": "FocusEvent",
        "resolved": "FocusEvent",
        "references": {
          "FocusEvent": {
            "location": "global"
          }
        }
      }
    }, {
      "method": "noiStyle",
      "name": "noiStyle",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [{
            "text": undefined,
            "name": "internal"
          }],
        "text": "Emitted when the styles change."
      },
      "complexType": {
        "original": "StyleEventDetail",
        "resolved": "StyleEventDetail",
        "references": {
          "StyleEventDetail": {
            "location": "local"
          }
        }
      }
    }]; }
  static get methods() { return {
    "setFocus": {
      "complexType": {
        "signature": "() => Promise<void>",
        "parameters": [],
        "references": {
          "Promise": {
            "location": "global"
          }
        },
        "return": "Promise<void>"
      },
      "docs": {
        "text": "Sets focus on the native `input` in `ion-input`. Use this method instead of the global\n`input.focus()`.",
        "tags": []
      }
    },
    "setBlur": {
      "complexType": {
        "signature": "() => Promise<void>",
        "parameters": [],
        "references": {
          "Promise": {
            "location": "global"
          }
        },
        "return": "Promise<void>"
      },
      "docs": {
        "text": "Sets blur on the native `input` in `ion-input`. Use this method instead of the global\n`input.blur()`.",
        "tags": [{
            "name": "internal",
            "text": undefined
          }]
      }
    },
    "getInputElement": {
      "complexType": {
        "signature": "() => Promise<HTMLInputElement>",
        "parameters": [],
        "references": {
          "Promise": {
            "location": "global"
          },
          "HTMLInputElement": {
            "location": "global"
          }
        },
        "return": "Promise<HTMLInputElement>"
      },
      "docs": {
        "text": "Returns the native `<input>` element used under the hood.",
        "tags": []
      }
    }
  }; }
  static get elementRef() { return "el"; }
  static get watchers() { return [{
      "propName": "debounce",
      "methodName": "debounceChanged"
    }, {
      "propName": "disabled",
      "methodName": "disabledChanged"
    }, {
      "propName": "value",
      "methodName": "valueChanged"
    }]; }
}
let inputIds = 0;
