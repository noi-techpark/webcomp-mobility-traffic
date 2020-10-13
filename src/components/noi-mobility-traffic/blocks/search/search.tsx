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

  render() {
    // TODO: add inputs class for color (placeholder/value)
    return (
    <Host>
      <div class="noi-search__inputs">
        <noi-button class="noi-search__input" onClick={this.onInputClick.bind(this, 'start')}>{this.getStart()}</noi-button>
        <noi-button class="noi-search__input" onClick={this.onInputClick.bind(this, 'end')}>{this.getEnd()}</noi-button>
      </div>
    </Host>);
  }
}
