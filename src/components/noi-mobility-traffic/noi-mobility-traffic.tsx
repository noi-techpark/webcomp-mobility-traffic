import { Component, h, Element, State } from '@stencil/core';
import { NoiAPI, NoiBTStation, NoiHighwayStation, NoiLinkStation } from '../../utils/api';
import { getLocaleComponentStrings } from '../../utils/locale';

@Component({
  tag: 'noi-mobility-traffic',
  styleUrl: 'noi-mobility-traffic.css',
  scoped: true
})
export class NoiMobilityTraffic {
  private strings: any;
  
  @Element() element: HTMLElement;
  @State() btStations: Array<NoiBTStation> = null;
  @State() highwayStations: Array<NoiHighwayStation> = null;
  @State() highwayLine: Array<[number, number]> = null;
  @State() linkStation: NoiLinkStation = null;
  @State() linkStations: Array<NoiLinkStation> = null;
  
  

  async componentWillLoad(): Promise<void> {
    this.strings = await getLocaleComponentStrings(this.element);
    
  }

  async componentDidLoad(): Promise<void> {
    try {
      // this.btStations = await NoiAPI.getBluetoothStations();
    } catch (error) {
      alert(error.code);
    }
    try {
      // this.highwayStations = await NoiAPI.getHighwayStations();
      // this.linkStation = await NoiAPI.getLinkStation('A22_ML103->A22_ML107');
      // this.linkStation = await NoiAPI.getLinkStation('Agip_Einstein->meinstein');
      // this.linkStations = await NoiAPI.getLinkStations();
      // debugger;
      // this.highwayLine = this.highwayStations.reduce((result, i) => {
      //   if (i.direction === 'unknown' || i.direction === 'vehicle') {
      //     return result;
      //   }
      //   const p = [i.coordinates.long, i.coordinates.lat];
      //   if (result.coordinates !== JSON.stringify(i.coordinates)) {
      //     result.data.push(p);
      //     result.coordinates = JSON.stringify(i.coordinates);
      //   }
      //   return result;
      // }, {data: [], coordinates: ''}).data;
    } catch (error) {
      alert(error.code);
    }
  }

  getBtMarkers() {
    const icon = 'https://image.flaticon.com/icons/svg/194/194648.svg';
    return this.btStations.map(s => {
      return (<leaflet-marker latitude={s.coordinates.long} longitude={s.coordinates.lat} icon-url={icon} icon-width="32" icon-height="32">
        {s.id}
      </leaflet-marker>)
    })
  }

  getHighwayCircles() {
    return this.highwayStations.map((s, i) => {
      return (<leaflet-circle
        latitude={s.coordinates.long}
        longitude={s.coordinates.lat}
        radius={20}
        stroke={1}

      >({i}) {s.id} - {s.position}
      </leaflet-circle>)
    })
  }

  getAllLinkStations() {
    return this.linkStations.map(s => {
      return <leaflet-geojson geometry={JSON.stringify(s.geometry)}></leaflet-geojson>;
    })
  }

  render() {
    return <div class="wrapper">
      <div>{this.strings.title}: {this.btStations ? (this.btStations.length): 0}</div>
      <div>
      <ion-button color="primary">Click me!</ion-button>
      </div>
      <noi-mobility-map class="map">
        {this.btStations ? (this.getBtMarkers()): null}
        {this.highwayStations ? (this.getHighwayCircles()): null}
        {this.highwayLine ? (<leaflet-polyline path={JSON.stringify(this.highwayLine)}></leaflet-polyline>): null}
        {this.linkStation ? (<leaflet-geojson geometry={JSON.stringify(this.linkStation.geometry)}></leaflet-geojson>): null}
        {this.linkStations ? (this.getAllLinkStations()): null}
      </noi-mobility-map>
    </div>;
  }
}
