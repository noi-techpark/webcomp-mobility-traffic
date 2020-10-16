import { Host, Component, h, getAssetPath, State } from '@stencil/core';
import noiStore, { selectCanLoadPath } from '@noi/store';

@Component({
  tag: 'noi-search',
  styleUrl: './search.css',
  scoped: true
})
export class Search {

  @State()
  durationMin: number = 0

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
      'search-station-btn': true,
      'search-station-btn--empty': !noiStore.startId,
      'search-station-btn--start': true
    }
    const endBtnClass = {
      'search-station-btn': true,
      'search-station-btn--empty': !noiStore.endId,
      'search-station-btn--end': true
    }

    return (
    <Host>
      <img class="search__logo" src={getAssetPath('./assets/logo.svg')} alt="BrennerLec"/>
      <div class="search__stations">
        <div class="search-stations__wrapper">
          <div class="search-stations__buttons">
            <noi-button class={startBtnClass} onClick={this.onInputClick.bind(this, 'start')}>
              <svg slot="start" height="20" viewBox="0 0 14 20" width="14" xmlns="http://www.w3.org/2000/svg"><path d="m7 0c3.8659932 0 7 3.13400675 7 7 0 2.57732883-2.3333333 6.9106622-7 13l-.60839506-.8015058c-4.26106996-5.6695486-6.39160494-9.73571332-6.39160494-12.1984942 0-3.86599325 3.13400675-7 7-7z" stroke-width="2"/></svg>
              {this.getStart()}
            </noi-button>
            <noi-button class={endBtnClass} onClick={this.onInputClick.bind(this, 'end')}>
            <svg slot="start" height="20" viewBox="0 0 14 20" width="14" xmlns="http://www.w3.org/2000/svg"><path d="m7 0c3.8659932 0 7 3.13400675 7 7 0 2.57732883-2.3333333 6.9106622-7 13l-.60839506-.8015058c-4.26106996-5.6695486-6.39160494-9.73571332-6.39160494-12.1984942 0-3.86599325 3.13400675-7 7-7z" stroke-width="2"/></svg>
              {this.getEnd()}
            </noi-button>
          </div>
          <noi-button class="search-reorder-btn" onClick={this.onReorderClick.bind(this)}>
            <svg slot="icon-only" class="search-reorder-btn__icon" height="23" viewBox="0 0 20 23" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m16.3379295 9 5.8258823 5.2432941-5.8258823 5.2432942-1.3379295-1.4865883 2.9659059-2.67-15.38399998.000353v-2l15.57799998-.000353-3.1599059-2.8434117zm-10.51204712-9 1.33792947 1.48658829-3.16081185 2.84341171 15.5789059.00035295v2l-15.3849059-.00035295 2.96681185 2.67-1.33792947 1.4865883-5.82588238-5.24329415z" transform="matrix(0 1 -1 0 20 0)"/></svg>
          </noi-button>
        </div>
      </div>
      {selectCanLoadPath() ? <noi-path-details></noi-path-details> : null}
      <footer>
        {selectCanLoadPath() ?
          <img class="search-footer__img" src={getAssetPath('./assets/mountains.svg')} alt=""/>
        : [
            <p class="search-footer__text">Smart travel <br/> decisions</p>,
          <img class="search-footer__img" src={getAssetPath('./assets/search.svg')} alt=""/>
        ]
        }
      </footer>
    </Host>);
  }
}
