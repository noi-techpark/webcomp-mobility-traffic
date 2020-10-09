import { Component, h, Element, State } from '@stencil/core';
import ResizeObserver from 'resize-observer-polyfill';
import { NoiAPI } from '../../utils/api';
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
  private resizeObserver: ResizeObserver;
  
  @Element() element: HTMLElement;
  @State() highwayPoints: Array<{coordinates: {lat, long}, id, name}> = null;
  @State() showSearch: boolean = true;
  
  

  async componentWillLoad(): Promise<void> {
    this.strings = await getLocaleComponentStrings(this.element);
    try {
      this.highwayPoints = await NoiAPI.getHighwayStations();
    } catch (error) {
      // TODO:
    }
  }

  async componentDidLoad(): Promise<void> {
    rIC(() => {
      import('./components/tap-click').then(module => module.startTapClick());
    });
    this.resizeObserver = new ResizeObserver(([entry]) => {
      this.applyMediaClasses(entry.contentRect.width, entry.contentRect.height);
    });
    this.resizeObserver.observe(this.element);
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
  }

  applyMediaClasses(widthPx: number, heightPx: number) {
    const greaterThanSmall = widthPx > 600;
    const greaterThanSmallLandscape = greaterThanSmall && widthPx > heightPx;
    this.element.classList.toggle('noi-media-gs', greaterThanSmall);
    this.element.classList.toggle('noi-media-gs--landscape', greaterThanSmallLandscape);
  }

  getHighwayCircles(highwayStations: Array<{id, coordinates: {lat, long}}>) {
    return highwayStations.map((s, i) => {
      return (<leaflet-circle
        latitude={s.coordinates.lat}
        longitude={s.coordinates.long}
        radius={20}
        stroke={1}

      >({i}) {s.id}
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
        {/* {this.highwayPoints ? (this.getHighwayCircles(this.highwayPoints)): null} */}
      </noi-mobility-map>
    </div>;
  }
}
