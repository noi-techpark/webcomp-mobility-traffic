import { Component, h, Element } from '@stencil/core';
import { getLocaleComponentStrings } from '../../utils/locale';

@Component({
  tag: 'noi-mobility-traffic',
  styleUrl: 'noi-mobility-traffic.css',
  shadow: true,
})
export class NoiMobilityTraffic {
  @Element() element: HTMLElement;
  
  private strings: any;

  async componentWillLoad(): Promise<void> {
    this.strings = await getLocaleComponentStrings(this.element);
    
  }

  render() {
    return <div class="wrapper">
      <div>{this.strings.title}</div>
      <noi-mobility-map class="map"></noi-mobility-map>
    </div>;
  }
}
