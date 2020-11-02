import { Component, Element, Event, Host, Prop, h } from '@stencil/core';
import { hasShadowDom } from '../helpers';
/**
 *
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot icon-only - Should be used on an icon in a button that has no text.
 * @slot start - Content is placed to the left of the button text in LTR, and to the right in RTL.
 * @slot end - Content is placed to the right of the button text in LTR, and to the left in RTL.
 *
 * @part native - The native HTML button or anchor element that wraps all child elements.
 */
export class Button {
  constructor() {
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
    return (h(Host, { onClick: this.handleClick, "aria-disabled": disabled ? 'true' : null, class: hostClass },
      h(TagType, Object.assign({}, attrs, { class: "noi-button__native", part: "native", disabled: disabled, onFocus: this.onFocus, onBlur: this.onBlur }),
        h("span", { class: "noi-button__inner" },
          h("slot", { name: "icon-only" }),
          h("slot", { name: "start" }),
          h("slot", null),
          h("slot", { name: "end" })))));
  }
  static get is() { return "noi-button"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["button.scss"]
  }; }
  static get styleUrls() { return {
    "$": ["button.css"]
  }; }
  static get properties() { return {
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
        "text": "If `true`, the user cannot interact with the button."
      },
      "attribute": "disabled",
      "reflect": true,
      "defaultValue": "false"
    },
    "expand": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "'full' | 'block'",
        "resolved": "\"block\" | \"full\"",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "Set to `\"block\"` for a full-width button or to `\"full\"` for a full-width button\nwithout left and right borders."
      },
      "attribute": "expand",
      "reflect": true
    },
    "fill": {
      "type": "string",
      "mutable": true,
      "complexType": {
        "original": "'clear' | 'outline' | 'solid' | 'default'",
        "resolved": "\"clear\" | \"default\" | \"outline\" | \"solid\"",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "Set to `\"clear\"` for a transparent button, to `\"outline\"` for a transparent\nbutton with a border, or to `\"solid\"`. The default style is `\"solid\"` except inside of\na toolbar, where the default is `\"clear\"`."
      },
      "attribute": "fill",
      "reflect": true
    },
    "download": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string | undefined",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "This attribute instructs browsers to download a URL instead of navigating to\nit, so the user will be prompted to save it as a local file. If the attribute\nhas a value, it is used as the pre-filled file name in the Save prompt\n(the user can still change the file name if they want)."
      },
      "attribute": "download",
      "reflect": false
    },
    "href": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string | undefined",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Contains a URL or a URL fragment that the hyperlink points to.\nIf this property is set, an anchor tag will be rendered."
      },
      "attribute": "href",
      "reflect": false
    },
    "rel": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string | undefined",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Specifies the relationship of the target object to the link object.\nThe value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types)."
      },
      "attribute": "rel",
      "reflect": false
    },
    "shape": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "'round'",
        "resolved": "\"round\"",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "The button shape."
      },
      "attribute": "shape",
      "reflect": true
    },
    "size": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "'small' | 'default' | 'large'",
        "resolved": "\"default\" | \"large\" | \"small\"",
        "references": {}
      },
      "required": false,
      "optional": true,
      "docs": {
        "tags": [],
        "text": "The button size."
      },
      "attribute": "size",
      "reflect": true
    },
    "strong": {
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
        "text": "If `true`, activates a button with a heavier font weight."
      },
      "attribute": "strong",
      "reflect": false,
      "defaultValue": "false"
    },
    "target": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string | undefined",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Specifies where to display the linked URL.\nOnly applies when an `href` is provided.\nSpecial keywords: `\"_blank\"`, `\"_self\"`, `\"_parent\"`, `\"_top\"`."
      },
      "attribute": "target",
      "reflect": false
    },
    "type": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "'submit' | 'reset' | 'button'",
        "resolved": "\"button\" | \"reset\" | \"submit\"",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "The type of the button."
      },
      "attribute": "type",
      "reflect": false,
      "defaultValue": "'button'"
    }
  }; }
  static get events() { return [{
      "method": "noiFocus",
      "name": "noiFocus",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Emitted when the button has focus."
      },
      "complexType": {
        "original": "void",
        "resolved": "void",
        "references": {}
      }
    }, {
      "method": "noiBlur",
      "name": "noiBlur",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Emitted when the button loses focus."
      },
      "complexType": {
        "original": "void",
        "resolved": "void",
        "references": {}
      }
    }]; }
  static get elementRef() { return "el"; }
}
