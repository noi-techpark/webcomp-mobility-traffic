import { Component, h, Element, State } from '@stencil/core';
import ResizeObserver from 'resize-observer-polyfill';
import { NoiAPI } from '../../api';
import { getLocaleComponentStrings } from '../../lang';
import { MapHighwayStation } from './blocks/map/map-entity';
import noiStore, { selectStationsWithSelected } from '../../store';

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
  @State() showSearch: boolean = true;
  
  onSelectBrenner() {
    noiStore.selectedId = '1840';
  }

  onUnSelectBrenner() {
    noiStore.selectedId = null;
  }

  async componentWillLoad(): Promise<void> {
    this.strings = await getLocaleComponentStrings(this.element);
    try {
      const stations = await NoiAPI.getHighwayStations();
      noiStore.stations = stations.reduce((result, s) => { result[s.id] = s; return result;}, {})
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

  getHighwayCircles() {
    return selectStationsWithSelected().map(s => {
      return (<MapHighwayStation {...s}></MapHighwayStation>)
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
        <noi-search>
        </noi-search>
      </noi-card>
      <noi-map>
        {noiStore.stations ? (this.getHighwayCircles()): null}
      </noi-map>
    </div>;
  }
}
