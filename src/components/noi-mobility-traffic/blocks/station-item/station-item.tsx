import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'noi-station-item',
  styleUrl: './station-item.css',
  scoped: true,
})
export class StationItem {
  @Prop()
  name!: string;
  @Prop()
  position!: number;
  @Prop()
  arrival: Date;

  render() {
    const hostClass = {
    };
    return (
      <Host class={hostClass}>
        <svg height="20" viewBox="-4 0 20 24" width="14" xmlns="http://www.w3.org/2000/svg"><path d="m7 0c3.8659932 0 7 3.13400675 7 7 0 2.57732883-2.3333333 6.9106622-7 13l-.60839506-.8015058c-4.26106996-5.6695486-6.39160494-9.73571332-6.39160494-12.1984942 0-3.86599325 3.13400675-7 7-7z"/></svg>
        <h3>{this.name}</h3>
        &nbsp;(<p>{(this.position/1000).toFixed(1)} km</p>)
        &nbsp;{this.arrival ? this.arrival : ''} 
      </Host>
    );
  }
}