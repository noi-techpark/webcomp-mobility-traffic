import { Host, Component, h, Prop, getAssetPath, Event, EventEmitter } from '@stencil/core';
import noiStore from '../../../../store';

@Component({
  tag: 'noi-stations-modal',
  styleUrl: './stations-modal.css',
  scoped: true,
  assetsDirs: ['../../assets']
})
export class StationsModal {
  @Prop() visible = false;
  @Prop() selecting: 'start' | 'end' = 'start';
  @Prop() overlayIndex = 1;
  @Event() modalClose!: EventEmitter<{stationId: string}>;

  onClose() {
    this.modalClose.emit();
  }

  getTitle() {
    if (this.selecting === 'start') {
      return  'Selezionare la partenza';
    }
    if (this.selecting === 'end') {
      return  'Selezionare la destinazione';
    }
  }

  renderStations() {
    if (!noiStore.stationsList) {
      return null;
    }
    return noiStore.stationsList.map(s => {
      return (
        <article class="station">{s.name}</article>
      );
    })
  }
  
  render() {
    const hostClass = {
      'slide-in': this.visible,
      'slide-out': !this.visible
    }
    const hostStyle = {
      zIndex: `${this.overlayIndex + 1}`,
    };
    return (
    <Host class={hostClass} style={hostStyle}>
      <div class="wrapper">
        <header>
          <noi-button fill="clear" onClick={this.onClose.bind(this)}>
            <img slot="icon-only" class="header__icon" src={getAssetPath('./assets/back.svg')} alt="Indietro"/>
          </noi-button>
          <span class="header__title">{this.getTitle()}</span>
        </header>
        <div class="search">
          <noi-input></noi-input>
        </div>
        <div class="list">
          {this.renderStations()}
        </div>
      </div>
    </Host>);
  }
}
