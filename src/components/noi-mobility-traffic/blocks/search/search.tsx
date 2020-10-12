import { Host, Component, h, getAssetPath } from '@stencil/core';
import noiStore from '../../../../store';

@Component({
  tag: 'noi-search',
  styleUrl: './search.css',
  scoped: true
})
export class Search {

  getStart() {
    return noiStore.start ? noiStore.start.name : ''
  }

  getEnd() {
    return noiStore.end ? noiStore.end.name : ''
  }

  render() {
    return (
    <Host>
      <div class="noi-search__img">
      </div>
      <div class="noi-search__inputs">
        <noi-input placeholder="Partenza?" value={this.getStart()}></noi-input>
        <hr/>
        <noi-input placeholder="Destinazione?" value={this.getEnd()}></noi-input>
      </div>
      <div class="noi-search__button">
        <noi-button fill="solid">
          <img slot="icon-only" src={getAssetPath(`./assets/reorder.svg`)}/>
        </noi-button>
      </div>
    </Host>);
  }
}
