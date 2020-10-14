import { Host, Component, h, getAssetPath } from '@stencil/core';
import noiStore from '../../../../store';

@Component({
  tag: 'noi-search',
  styleUrl: './search.css',
  scoped: true
})
export class Search {

  getStart() {
    // TODO: get placeholder from strings
    return noiStore.start ? noiStore.start.name : 'Partenza?'
  }

  getEnd() {
    // TODO: get placeholder from strings
    return noiStore.end ? noiStore.end.name : 'Destinazione?'
  }

  onInputClick(what: 'start' | 'end') {
    noiStore.selecting = what;
  }

  onReorderClick() {
    const startId = noiStore.startId;
    const endId = noiStore.endId;
    if (startId) {
      noiStore.endId = startId;
    }
    if (endId) {
      noiStore.startId = endId;
    }
  }

  render() {
    const startBtnClass = {
      'noi-search__station-btn--empty': !noiStore.startId,
      'noi-search__station-btn': true
    }
    const endBtnClass = {
      'noi-search__station-btn--empty': !noiStore.endId,
      'noi-search__station-btn': true
    }

    return (
    <Host>
      <img class="noi-search__logo" src={getAssetPath('./assets/logo.svg')} alt="BrennerLec"/>
      <div class="noi-search__stations">
        <div class="stations__wrapper">
          <div class="stations__buttons">
            <noi-button class={startBtnClass} onClick={this.onInputClick.bind(this, 'start')}>{this.getStart()}</noi-button>
            <noi-button class={endBtnClass} onClick={this.onInputClick.bind(this, 'end')}>{this.getEnd()}</noi-button>
          </div>
          <noi-button class="noi-search__reorder-btn" onClick={this.onReorderClick.bind(this)}>
            <svg slot="icon-only" class="noi-search__reorder-btn-icon" height="23" viewBox="0 0 20 23" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m16.3379295 9 5.8258823 5.2432941-5.8258823 5.2432942-1.3379295-1.4865883 2.9659059-2.67-15.38399998.000353v-2l15.57799998-.000353-3.1599059-2.8434117zm-10.51204712-9 1.33792947 1.48658829-3.16081185 2.84341171 15.5789059.00035295v2l-15.3849059-.00035295 2.96681185 2.67-1.33792947 1.4865883-5.82588238-5.24329415z" transform="matrix(0 1 -1 0 20 0)"/></svg>
          </noi-button>
        </div>
      </div>
      <p class="noi-search__footer-text">Smart travel <br/> decisions</p>
      <img class="noi-search__footer-img" src={getAssetPath('./assets/search.svg')} alt=""/>
    </Host>);
  }
}
