import { Host, Component, h, Prop, Event, EventEmitter, State, Watch } from '@stencil/core';
import noiStore, { selectStationsWithSelected } from '@noi/store';
import { translate } from '@noi/lang';

@Component({
  tag: 'noi-stations-modal',
  styleUrl: './stations-modal.css',
  scoped: true
})
export class StationsModal {
  @Prop() visible = false;
  @Prop() selecting: 'start' | 'end' = 'start';
  @Prop() overlayIndex = 1;
  @Event() modalClose!: EventEmitter<{stationId: string}>;
  @State() searchText = '';
  @State() hostClass: {slideIn?: boolean, slideOut?: boolean} = {}

  @Watch('visible')
  onVisibleChange(newValue) {
    this.hostClass = this.getHostClass(newValue);
  }


  onClose() {
    this.modalClose.emit();
    this.searchText = '';
  }

  getTitle() {
    return translate(`stations-modal.header-${this.selecting}`);
  }

  onSearchChange(value: CustomEvent<{value: string}>) {
    this.searchText = value ? value.detail.value.toLowerCase() : '';
  }

  private stationSelectedToggle(id) {
    noiStore.selectedId = id;
  }

  private onSelectStation(id: string) {
    if (this.selecting === 'start') {
      noiStore.startId = id;
    }
    if (this.selecting === 'end') {
      noiStore.endId = id;
    }
  }

  renderStations() {
    if (!noiStore.stationsList) {
      return null;
    }
    const notSelectedId = this.selecting === 'start' ? noiStore.endId : noiStore.startId;
    return selectStationsWithSelected()
      .filter(s => s.name.toLowerCase().includes(this.searchText) && s.id !== notSelectedId)
      .map(s => {
        const stationClass = {
          station: true,
          'station--selected': s.selected,
          'station--end': this.selecting === 'end'
        };
        return (
          <article class={stationClass} onClick={this.stationSelectedToggle.bind(this, s.id)}>
            <svg class="station__icon" height="20" viewBox="-4 -4 20 24" width="14" xmlns="http://www.w3.org/2000/svg"><path d="m7 0c3.8659932 0 7 3.13400675 7 7 0 2.57732883-2.3333333 6.9106622-7 13l-.60839506-.8015058c-4.26106996-5.6695486-6.39160494-9.73571332-6.39160494-12.1984942 0-3.86599325 3.13400675-7 7-7z" stroke-width="2"/></svg>
            {s.name}
            <noi-button size="small" class="station__select-btn button-md" onClick={this.onSelectStation.bind(this, s.id)}>
              {translate('stations-modal.select-btn')}
            </noi-button>
          </article>
        );
      })
  }

  getHostClass(visible: boolean) {
    if (visible) {
      return {slideIn: true};
    }
    if (!visible && this.hostClass.slideIn) {
      return {slideOut: true};
    }
    return {};
  }
  
  render() {
    const hostClass = {
      'slide-in': this.hostClass.slideIn,
      'slide-out': this.hostClass.slideOut
    }
    const hostStyle = {
      zIndex: `${this.overlayIndex + 1}`,
    };
    return (
    <Host class={hostClass} style={hostStyle}>
      <div class="wrapper">
        <header>
          <noi-button fill="clear" onClick={this.onClose.bind(this)}>
            <svg slot="icon-only" class="header__icon" height="14" viewBox="0 0 10 14" width="10" xmlns="http://www.w3.org/2000/svg"><path d="m0 1.53073535 1.28718658-1.53073535 8.35973178 7.02965056-8.35973178 7.02965054-1.28718658-1.5307353 6.53859329-5.49919813z" transform="matrix(-1 0 0 1 9.646918 0)"/></svg>
          </noi-button>
          <span class="header__title">{this.getTitle()}</span>
        </header>
        <div class="search">
          <noi-input debounce={100} onNoiChange={this.onSearchChange.bind(this)} placeholder={translate('stations-modal.input-placeholder')}></noi-input>
        </div>
        <div class="list">
          {this.renderStations()}
        </div>
      </div>
    </Host>);
  }
}
