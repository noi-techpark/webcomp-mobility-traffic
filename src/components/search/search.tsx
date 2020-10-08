import { Host, Component, h } from '@stencil/core';

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
        <noi-input placeholder="Destinazione?"></noi-input>
      </div>
      <div class="noi-search__button">
        <noi-button class="button-md" fill="solid" shape="round"></noi-button>
      </div>
    </Host>);
  }
}
