import { Component, h, Element, State } from '@stencil/core';
import { NoiAPI, NoiBTStation } from '../../utils/api';
import { getLocaleComponentStrings } from '../../utils/locale';

@Component({
  tag: 'noi-mobility-traffic',
  styleUrl: 'noi-mobility-traffic.css',
  shadow: true,
})
export class NoiMobilityTraffic {
  private strings: any;
  
  @Element() element: HTMLElement;
  @State() stations: Array<NoiBTStation> = null;
  
  

  async componentWillLoad(): Promise<void> {
    this.strings = await getLocaleComponentStrings(this.element);
    
  }

  async componentDidLoad(): Promise<void> {
    try {
      this.stations = await NoiAPI.getBluetoothStations();
    } catch (error) {
      alert(error.code);
    }
  }

  getMarkers() {
    return this.stations.map(s => {
      return (<leaflet-marker latitude={s.coordinates.long} longitude={s.coordinates.lat} icon-url="https://image.flaticon.com/icons/svg/194/194648.svg" icon-width="32" icon-height="32">
        {s.id}
      </leaflet-marker>)
    })
  }

  render() {
    return <div class="wrapper">
      <div>{this.strings.title}: {this.stations ? (this.stations.length): 0}</div>
      <noi-mobility-map class="map">
        {this.stations ? (this.getMarkers()): null}
      </noi-mobility-map>
    </div>;
  }
}
