// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, ComponentInterface, Event, EventEmitter, Host, Listen, Prop, h } from '@stencil/core';

@Component({
  tag: 'noi-backdrop',
  styleUrl: 'backdrop.css',
  scoped: true,
})
export class Backdrop implements ComponentInterface {
  @Prop() overlayIndex = 1;
  @Prop() visible = true;
  @Prop() tappable = true;
  @Prop() stopPropagation = true;
  @Event() noiBackdropTap!: EventEmitter<void>;

  @Listen('click', { passive: false, capture: true })
  protected onMouseDown(ev: TouchEvent) {
    this.emitTap(ev);
  }

  private emitTap(ev: Event) {
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
      zIndex: `${ this.visible ? this.overlayIndex : -1}`
    };

    return (<Host tabindex="-1" class={hostClass} style={hostStyle}></Host>);
  }
}
