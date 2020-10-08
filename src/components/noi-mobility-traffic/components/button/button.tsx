import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Prop, h } from '@stencil/core';

import { hasShadowDom } from '../helpers';

export interface AnchorInterface {
  href: string | undefined;
  target: string | undefined;
  rel: string | undefined;
  download: string | undefined;
}

export interface ButtonInterface {
  type: 'submit' | 'reset' | 'button';
  disabled: boolean;
}
/**
 *
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot icon-only - Should be used on an icon in a button that has no text.
 * @slot start - Content is placed to the left of the button text in LTR, and to the right in RTL.
 * @slot end - Content is placed to the right of the button text in LTR, and to the left in RTL.
 *
 * @part native - The native HTML button or anchor element that wraps all child elements.
 */
@Component({
  tag: 'noi-button',
  styleUrl: 'button.scss',
  shadow: true,
})
export class Button implements ComponentInterface, AnchorInterface, ButtonInterface {
  private inItem = false;

  @Element() el!: HTMLElement;

  /**
   * If `true`, the user cannot interact with the button.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * Set to `"block"` for a full-width button or to `"full"` for a full-width button
   * without left and right borders.
   */
  @Prop({ reflect: true }) expand?: 'full' | 'block';

  /**
   * Set to `"clear"` for a transparent button, to `"outline"` for a transparent
   * button with a border, or to `"solid"`. The default style is `"solid"` except inside of
   * a toolbar, where the default is `"clear"`.
   */
  @Prop({ reflect: true, mutable: true }) fill?: 'clear' | 'outline' | 'solid' | 'default';

  /**
   * This attribute instructs browsers to download a URL instead of navigating to
   * it, so the user will be prompted to save it as a local file. If the attribute
   * has a value, it is used as the pre-filled file name in the Save prompt
   * (the user can still change the file name if they want).
   */
  @Prop() download: string | undefined;

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href: string | undefined;

  /**
   * Specifies the relationship of the target object to the link object.
   * The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).
   */
  @Prop() rel: string | undefined;

  /**
   * The button shape.
   */
  @Prop({ reflect: true }) shape?: 'round';

  /**
   * The button size.
   */
  @Prop({ reflect: true }) size?: 'small' | 'default' | 'large';

  /**
   * If `true`, activates a button with a heavier font weight.
   */
  @Prop() strong = false;

  /**
   * Specifies where to display the linked URL.
   * Only applies when an `href` is provided.
   * Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`.
   */
  @Prop() target: string | undefined;

  /**
   * The type of the button.
   */
  @Prop() type: 'submit' | 'reset' | 'button' = 'button';

  /**
   * Emitted when the button has focus.
   */
  @Event() noiFocus!: EventEmitter<void>;

  /**
   * Emitted when the button loses focus.
   */
  @Event() noiBlur!: EventEmitter<void>;

  componentWillLoad() {
    this.inItem = !!this.el.closest('noi-item') || !!this.el.closest('noi-item-divider');
  }

  private get hasIconOnly() {
    return !!this.el.querySelector('[slot="icon-only"]');
  }

  private handleClick = (ev: Event) => {
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
  }

  private onFocus = () => {
    this.noiFocus.emit();
  }

  private onBlur = () => {
    this.noiBlur.emit();
  }

  render() {
    const { type, disabled, rel, target, size, href, expand, hasIconOnly, shape, strong } = this;
    const finalSize = size === undefined && this.inItem ? 'small' : size;
    const TagType = href === undefined ? 'button' : 'a' as any;
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
    return (
      <Host
        onClick={this.handleClick}
        aria-disabled={disabled ? 'true' : null}
        class={hostClass}
      >
        <TagType
          {...attrs}
          class="noi-button__native"
          part="native"
          disabled={disabled}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        >
          <span class="noi-button__inner">
            <slot name="icon-only"></slot>
            <slot name="start"></slot>
            <slot></slot>
            <slot name="end"></slot>
          </span>
        </TagType>
      </Host>
    );
  }
}
