import { Component, h, Element, State } from '@stencil/core';
import ResizeObserver from 'resize-observer-polyfill';
import { NoiAPI } from '../../api';
import { getLocaleComponentStrings } from '../../lang';
import { MapStation } from './blocks/map/map-station';
import noiStore, { selectStartEnd, selectStationsWithSelectedWithStartEnd } from '../../store';
import { MapMarker } from './blocks/map/map-marker';

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
  private stationsModalEl: HTMLNoiStationsModalElement;
  private searchEl: HTMLNoiSearchElement;
  
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
    if (this.stationsModalEl) {
      this.stationsModalEl.classList.toggle('noi-media-gs', greaterThanSmall);
      this.stationsModalEl.classList.toggle('noi-media-gs--landscape', greaterThanSmallLandscape);
    }
    if (this.searchEl) {
      this.searchEl.classList.toggle('noi-media-gs', greaterThanSmall);
      this.searchEl.classList.toggle('noi-media-gs--landscape', greaterThanSmallLandscape);
    }

  }

  getHighwayCircles() {
    if (!noiStore.stations) {
      return null;
    }
    return selectStationsWithSelectedWithStartEnd().map(s => {
      return (<MapStation {...s}></MapStation>)
    })
  }

  getHighwayMarkers() {
    if (!noiStore.startId && !noiStore.endId) {
      return null;
    }
    return selectStartEnd().map(s => (
      <MapMarker {...s}></MapMarker>
    ));
  }

  getAllLinkStations(linkStations) {
    return linkStations.map(s => {
      return <leaflet-geojson geometry={JSON.stringify(s.geometry)}></leaflet-geojson>;
    })
  }

  onModalClose() {
    noiStore.selecting = null;
  }

  render() {
    return <div class="wrapper">
      <noi-backdrop
        overlayIndex={2}
        visible={!!noiStore.selecting}
        onNoiBackdropTap={this.onModalClose.bind(this)}>
      </noi-backdrop>
      <noi-stations-modal
        selecting={noiStore.selecting}
        ref={el => this.stationsModalEl = el as HTMLNoiStationsModalElement} 
        onModalClose={this.onModalClose.bind(this)}
        overlayIndex={2}
        visible={!!noiStore.selecting}
      ></noi-stations-modal>
      <noi-search
        class="search"
        ref={el => this.searchEl = el as HTMLNoiSearchElement}>
      </noi-search>
      <noi-map>
        {this.getHighwayCircles()}
        {this.getHighwayMarkers()}
      </noi-map>
    </div>;
  }
}
