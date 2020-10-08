import { Component, h, Element, State } from '@stencil/core';
import { NoiLinkStation } from '../../utils/api';
import { getLocaleComponentStrings } from '../../utils/locale';

const rIC = (callback: () => void) => {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback);
  } else {
    setTimeout(callback, 32);
  }
};

@Component({
  tag: 'noi-mobility-traffic',
  styleUrl: 'noi-mobility-traffic.css',
  scoped: true,
  assetsDirs: ['assets']
})
export class NoiMobilityTraffic {
  private strings: any;
  
  @Element() element: HTMLElement;
  @State() linkStations: Array<NoiLinkStation> = null;
  @State() showSearch: boolean = true;
  
  

  async componentWillLoad(): Promise<void> {
    this.strings = await getLocaleComponentStrings(this.element);
    
  }

  async componentDidLoad(): Promise<void> {
    rIC(() => {
      import('./components/tap-click').then(module => module.startTapClick());
    });
  }

  getHighwayCircles(highwayStations) {
    return highwayStations.map((s, i) => {
      return (<leaflet-circle
        latitude={s.coordinates.long}
        longitude={s.coordinates.lat}
        radius={20}
        stroke={1}

      >({i}) {s.id} - {s.position}
      </leaflet-circle>)
    })
  }

  getAllLinkStations(linkStations) {
    return linkStations.map(s => {
      return <leaflet-geojson geometry={JSON.stringify(s.geometry)}></leaflet-geojson>;
    })
  }


  render() {
    return <div class="wrapper">
      <noi-card class="search">
        <noi-search></noi-search>
      </noi-card>
      <noi-mobility-map class="map">
        {this.linkStations ? (this.getAllLinkStations(this.linkStations)): null}
      </noi-mobility-map>
    </div>;
  }
}
