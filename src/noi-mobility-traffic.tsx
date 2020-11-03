import { NoiAPI } from '@noi/api';
import { urbanPathState } from '@noi/store/path-store';
import noiStore, { selectStartEnd, selectStationsWithSelectedWithStartEnd } from '@noi/store';
import { NoiError, NOI_ERR_UNKNOWN } from '@noi/api/error';
import { getLocaleComponentStrings, translate } from '@noi/lang';
import { Component, Element, State, h, getAssetPath } from '@stencil/core';
import ResizeObserver from 'resize-observer-polyfill';

import { MapMarker } from './blocks/map/map-marker';
import { MapStation } from './blocks/map/map-station';
import { startTapClick } from './components/tap-click';

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
  scoped: true
})
export class NoiMobilityTraffic {
  private resizeObserver: ResizeObserver;
  private stationsModalEl: HTMLNoiStationsModalElement;
  private searchEl: HTMLNoiSearchElement;
  
  @Element() element: HTMLElement;
  @State() showSearch: boolean = true;
  @State() errorCode: string = undefined;
  @State() loading: boolean = true;

  async loadLocaleAndStations() {
    this.errorCode = undefined;
    this.loading = true;
    try {
      await getLocaleComponentStrings(this.element);
      const stations = await NoiAPI.getHighwayStations();
      noiStore.stations = stations.reduce((result, s) => { result[s.id] = s; return result;}, {})
      this.loading = false;
    } catch (error) {
      if (error instanceof NoiError) {
        this.errorCode = error.code;
      } else {
        this.errorCode = NOI_ERR_UNKNOWN;
      }
      this.loading = false;
    }
  }

  async componentDidLoad(): Promise<void> {
    await this.loadLocaleAndStations();
    rIC(startTapClick);
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

  getPathCircles() {
    if (!noiStore.stations) {
      return null;
    }
    return selectStationsWithSelectedWithStartEnd().map(s => {
      return (<MapStation {...s}></MapStation>)
    })
  }

  getUrbanPath() {
    if (noiStore.activePath !== 'urban') {
      return null;
    }
    if (urbanPathState.loading || urbanPathState.errorCode || !urbanPathState.path) {
      return null;
    }
    return urbanPathState.path.map(s => (<noi-map-route geometry={JSON.stringify(s.geometry)}></noi-map-route>));
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
    if (this.loading) {
      return (<div class="wrapper">
        <div class="loading">
          <div class="loading-img">
            <img src={getAssetPath('./search.svg')} alt=""/>
          </div>
        </div>
      </div>);
    }
    if (this.errorCode) {
      return (<div class="wrapper">
        <div class="error">
          <h2>{translate(this.errorCode)}</h2>
          <noi-button fill="solid" class="button-md error-btn" onClick={this.loadLocaleAndStations.bind(this)}>Retry</noi-button>
        </div>
      </div>)
    }
    urbanPathState.startId = noiStore.startId;
    urbanPathState.endId = noiStore.endId;
    return <div class="wrapper">
      <noi-backdrop
        overlayIndex={2}
        visible={!!noiStore.selecting}
        onNoiBackdropTap={this.onModalClose.bind(this)}>
      </noi-backdrop>
      <noi-stations-modal
        ref={el => this.stationsModalEl = el as HTMLNoiStationsModalElement} 
        selecting={noiStore.selecting}
        onModalClose={this.onModalClose.bind(this)}
        overlayIndex={2}
        visible={!!noiStore.selecting}
      ></noi-stations-modal>
      <noi-search ref={el => this.searchEl = el as HTMLNoiSearchElement}>
      </noi-search>
      <noi-map
        lat={noiStore.mapCenter.lat}
        long={noiStore.mapCenter.long}>
        {this.getUrbanPath()}
        {this.getHighwayCircles()}
        {this.getHighwayMarkers()}
      </noi-map>
    </div>;
  }
}
