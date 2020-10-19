import { Component, ComponentInterface, Host, h } from '@stencil/core';

@Component({
  tag: 'noi-card',
  styleUrl: 'card.scss',
  shadow: true
})
export class Card implements ComponentInterface {

  render() {
    return (
      <Host>
        <div class="noi-card__native" part="native">
          <slot></slot>
        </div>
      </Host>
    );
  }
}