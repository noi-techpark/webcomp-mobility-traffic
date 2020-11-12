import { NoiAPI } from '@noi/api';
import { urbanPathState } from '@noi/store/urban-path.store';
import noiStore, { selectStartEnd, selectStationsWithSelectedWithStartEnd } from '@noi/store';
import { NoiError, NOI_ERR_UNKNOWN } from '@noi/api/error';
import { getLocaleComponentStrings, translate } from '@noi/lang';
import { Component, Element, State, h, getAssetPath } from '@stencil/core';
import ResizeObserver from 'resize-observer-polyfill';

import { MapMarker } from './blocks/map/map-marker';
import { MapStation } from './blocks/map/map-station';
import { startTapClick } from './components/tap-click';
import { fnDebounce } from './utils';
import { pathState } from './store/path.store';

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
    /** If any changes are incurred during the callback, then layout happens again,
     * but here, the system finds the shallowest at which depth a change occurred
     * (measured in simple node depth from the root).
     * Any changes that are related to something deeper down in the tree are delivered at once,
     * while any that are not are queued up and delivered in the next frame,
     * and an error message will be sent to the Web Inspector console:
     * (ResizeObserver loop completed with undelivered notifications)
     * 
     * So, to avoid this, just debounce the callback
     *  */ 
    this.resizeObserver = new ResizeObserver(fnDebounce(100, ([entry]) => {
      this.applyMediaClasses(entry.contentRect.width, entry.contentRect.height);
    }));
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
    return urbanPathState.path.map(s => {
      return <noi-map-route jam={s.jamLevel} geometry={JSON.stringify(s.geometry)}></noi-map-route>
    });
  }

  getPath() {
    if (noiStore.activePath !== 'highway') {
      return null;
    }
    if (pathState.loading || pathState.errorCode || !pathState.path) {
      return null;
    }
    return pathState.path.map(s => {
      return <noi-map-route jam={s.jamLevel} geometry={JSON.stringify(s.geometry)}></noi-map-route>
    });
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

  renderError() {
    return (
      <div class="wrapper">
        <div class="error">
          <h2>{translate(this.errorCode)}</h2>
          <noi-button fill="solid" class="button-md error-btn" onClick={this.loadLocaleAndStations.bind(this)}>Retry</noi-button>
        </div>
      </div>
    );
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
      return this.renderError();
    }
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
        {/* {this.getPath()} */}
        {this.getHighwayCircles()}
        {this.getHighwayMarkers()}
      </noi-map>
    </div>;
  }
}
