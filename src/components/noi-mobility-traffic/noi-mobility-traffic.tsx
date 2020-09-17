import { Component, h, Element, State } from '@stencil/core';
import { NoiAPI } from '../../utils/api';
import { getLocaleComponentStrings } from '../../utils/locale';

@Component({
  tag: 'noi-mobility-traffic',
  styleUrl: 'noi-mobility-traffic.css',
  shadow: true,
})
export class NoiMobilityTraffic {
  private strings: any;
  
  @Element() element: HTMLElement;
  @State() treeLength = 0;
  
  

  async componentWillLoad(): Promise<void> {
    this.strings = await getLocaleComponentStrings(this.element);
    
  }

  async componentDidLoad(): Promise<void> {
    try {
      this.treeLength = (await NoiAPI.getTree()).length;
    } catch (error) {
      alert(error.code);
    }
  }

  render() {
    return <div class="wrapper">
      <div>{this.strings.title}. Tree length={this.treeLength}</div>
      <noi-mobility-map class="map"></noi-mobility-map>
    </div>;
  }
}
