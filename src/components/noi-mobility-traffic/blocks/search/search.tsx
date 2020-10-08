import { Host, Component, h, getAssetPath } from '@stencil/core';

@Component({
  tag: 'noi-search',
  styleUrl: './search.css',
  scoped: true
})
export class Search {
  render() {
    return (
    <Host>
      <div class="noi-search__img">
      </div>
      <div class="noi-search__inputs">
        <noi-input placeholder="Partenza?"></noi-input>
        <hr/>
        <noi-input placeholder="Destinazione?"></noi-input>
      </div>
      <div class="noi-search__button">
        <noi-button fill="solid">
          <img slot="icon-only" src={getAssetPath(`./assets/reorder.svg`)}/>
        </noi-button>
      </div>
    </Host>);
  }
}
