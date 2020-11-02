import { ComponentInterface, EventEmitter } from '../../stencil-public-runtime';
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
export declare class Button implements ComponentInterface, AnchorInterface, ButtonInterface {
  private inItem;
  el: HTMLElement;
  /**
   * If `true`, the user cannot interact with the button.
   */
  disabled: boolean;
  /**
   * Set to `"block"` for a full-width button or to `"full"` for a full-width button
   * without left and right borders.
   */
  expand?: 'full' | 'block';
  /**
   * Set to `"clear"` for a transparent button, to `"outline"` for a transparent
   * button with a border, or to `"solid"`. The default style is `"solid"` except inside of
   * a toolbar, where the default is `"clear"`.
   */
  fill?: 'clear' | 'outline' | 'solid' | 'default';
  /**
   * This attribute instructs browsers to download a URL instead of navigating to
   * it, so the user will be prompted to save it as a local file. If the attribute
   * has a value, it is used as the pre-filled file name in the Save prompt
   * (the user can still change the file name if they want).
   */
  download: string | undefined;
  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  href: string | undefined;
  /**
   * Specifies the relationship of the target object to the link object.
   * The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).
   */
  rel: string | undefined;
  /**
   * The button shape.
   */
  shape?: 'round';
  /**
   * The button size.
   */
  size?: 'small' | 'default' | 'large';
  /**
   * If `true`, activates a button with a heavier font weight.
   */
  strong: boolean;
  /**
   * Specifies where to display the linked URL.
   * Only applies when an `href` is provided.
   * Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`.
   */
  target: string | undefined;
  /**
   * The type of the button.
   */
  type: 'submit' | 'reset' | 'button';
  /**
   * Emitted when the button has focus.
   */
  noiFocus: EventEmitter<void>;
  /**
   * Emitted when the button loses focus.
   */
  noiBlur: EventEmitter<void>;
  componentWillLoad(): void;
  private get hasIconOnly();
  private handleClick;
  private onFocus;
  private onBlur;
  render(): any;
}