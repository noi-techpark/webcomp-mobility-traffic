import { Component, Element, Prop, Watch, h } from '@stencil/core';
import { Browser, CircleMarker, GeoJSON, Map, TileLayer } from 'leaflet';

import {
  highlightHighwayStation,
  MAP_ENTITY_STATION,
  renderHighwayStationElement,
  unHighlightHighwayStation,
} from './map-entity';

import noiStore from '../../../../store';

interface LayerObserver<T> {
  layer: T,
  observer: MutationObserver,
}

function isNotAssigned(value: any) {
  return value === undefined || value === null || isNaN(value);
}

const TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

@Component({
  tag: 'noi-map',
  styleUrl: 'map.css'
})
export class NoiMap {
  map: Map = null;
  userMarker: any = null;
  childrenObserver: MutationObserver = null;
  entityChildren: WeakMap<any, LayerObserver<CircleMarker>> = new WeakMap();
  pathChildren: WeakMap<any, LayerObserver<GeoJSON>> = new WeakMap();
  popupElement!: HTMLElement;

  @Element() el: HTMLElement;

  @Prop({ mutable: true }) lat: number = 46.4983;
  @Prop({ mutable: true }) long: number = 11.3548;
  @Prop({ mutable: true }) scale: number = 13;

  componentDidLoad() {
    this.map = new Map(this.el, { zoomControl: false });
    this.updateCenterAndZoom();
    new TileLayer(TILE_LAYER).addTo(this.map);
    this.renderChildren();
    this.childrenObserver = new MutationObserver((mutations: Array<any>) =>
      this.childrenObserverCallback(mutations)
    );
    this.childrenObserver.observe(this.el, { attributes: false, childList: true, subtree: false });
  }

  disconnectedCallback() {
    this.childrenObserver.disconnect();
  }

  @Watch('lat')
  latHandler(newValue: number, _oldValue: number): void {
    this.lat = newValue;
    this.updateCenterAndZoom();
  }

  @Watch('long')
  longHandler(newValue: number, _oldValue: number): void {
    this.long = newValue;
    this.updateCenterAndZoom();
  }

  @Watch('scale')
  scaleHandler(newValue: number, _oldValue: number): void {
    this.scale = newValue;
    this.updateCenterAndZoom();
  }

  entityAttrsObserver(el: any, mutationsList: Array<any>) : void {
    for (const mutation of mutationsList) {
      if (mutation.type !== 'attributes')  continue;
      if (['lat', 'long'].includes(mutation.attributeName)) {
        this.entityChildren.get(el).layer.setLatLng([el.getAttribute('lat'), el.getAttribute('long')]);
      }
      if (['class'].includes(mutation.attributeName)) {
        const layer = this.entityChildren.get(el).layer;
        const newClasses = (el.getAttribute('class') + '').split(' ');
        const oldClasses = (layer.getElement().classList.value + '').split(' ').filter(c => !c.startsWith('leaflet-'));
        oldClasses.forEach(c => {
          layer.getElement().classList.remove(c);
        });
        newClasses.forEach(c => {
          layer.getElement().classList.add(c);
        });
        if (!Browser.ie && !Browser.opera && !Browser.edge) {
          layer.bringToFront();
      }
      }
    }
  }

  childrenObserverCallback(mutationsList: Array<any>): void {
    for (const mutation of mutationsList) {
      if (mutation.type !== 'childList') continue;
      this.removeChildren(mutation.removedNodes);
      this.renderChildren();
    }
  }

  removeChildren(nodes: Array<any>) {
    nodes.forEach(node => {
      if (!node.nodeName.startsWith("NOI-")) {
        return;
      }
      const entityEl = this.entityChildren.get(node);
      if (entityEl) {
        this.map.removeLayer(entityEl.layer);
        if (entityEl.observer) entityEl.observer.disconnect();
        this.entityChildren.delete(node);
        return;
      }
      const pathEl = this.pathChildren.get(node);
      if (pathEl) {
        this.map.removeLayer(pathEl.layer);
        if (pathEl.observer) {
          pathEl.observer.disconnect();
        }
        this.pathChildren.delete(node);
        return;
      }
    });
  }

  private renderMapEntity(e: Element) {
    const type: string = e.getAttribute('entity-type');
    const id: string = e.getAttribute('entity-id');
    
    // TODO: create a factory
    if (type === MAP_ENTITY_STATION) {
      const layer = renderHighwayStationElement(e);
      layer.on({
        mouseover: highlightHighwayStation,
        mouseout: unHighlightHighwayStation,
        click: (e) => {
          const latLong = (e.target as CircleMarker).getLatLng();
          this.map.setView(latLong, this.scale);
          noiStore.selectedId = id;
        }
      });
      const observer = new MutationObserver((mutations: Array<any>, _observer: any) => this.entityAttrsObserver(e, mutations));
      observer.observe(e, { attributes: true, childList: false, subtree: false });
      this.entityChildren.set(e, {layer, observer});
      layer.addTo(this.map);
      layer.bindPopup(this.popupElement, {minWidth: 350});
      layer.getPopup().on('remove', () => noiStore.selectedId = '');
    }
  }

  private renderGeoJson(e: Element) {
    const geometry = JSON.parse(e.getAttribute('geometry'));
    const layer = new GeoJSON(geometry, geometry);
    this.pathChildren.set(e, {layer, observer: null});
    layer.addTo(this.map);
  }

  renderChildren(): void {
    Array.from(this.el.children).map(e => {
      if (this.entityChildren.get(e) !== undefined) {
        return;
      }
      if (this.pathChildren.get(e) !== undefined) {
        return;
      }
      switch (e.nodeName) {
        case 'NOI-MAP-ENTITY':
          this.renderMapEntity(e);
          break;
        case 'NOI-MAP-ROUTE':
          this.renderGeoJson(e);
          break;
        default:
          break;
      }
    });
  }

  updateCenterAndZoom(): void {
    if (isNotAssigned(this.lat) || isNotAssigned(this.long)) {
      return;
    }
    this.map.setView([this.lat, this.long], this.scale);
  }

  onSetAsStart() {
    noiStore.startId = noiStore.selectedId;
    noiStore.selectedId = '';
    this.map.closePopup();
  }

  onSetAsEnd() {
    noiStore.endId = noiStore.selectedId;
    noiStore.selectedId = '';
    this.map.closePopup();
  }

  renderSetAsStartButton() {
    if (noiStore.selectedId === noiStore.startId) {
      return null;
    }
    // const title = noiStore.startId ? "Change origin" : "Set origin";
    // TODO: get from strings
    const title = 'Da qui';
    return (
      <noi-button fill="solid" class="button-md noi-map-station-popup__btn" onClick={this.onSetAsStart.bind(this)}>
        {title}
      </noi-button>
    );
  }

  renderSetAsEndButton() {
    if (noiStore.selectedId === noiStore.endId) {
      return null;
    }
    // const title = noiStore.endId ? "Change destination" : "Set destination";
    // TODO: get from strings
    const title = 'A qua';
    return (
      <noi-button fill="solid" class="button-md noi-map-station-popup__btn" onClick={this.onSetAsEnd.bind(this)}>
        {title}
      </noi-button>
    );
  }

  renderSelectedStationPopup() {
    return (
      <div class="noi-map-station-popup">
        <div class="noi-map-station-popup__header">{noiStore.selected.name}</div>
        <div class="noi-map-station-popup__content">
          {this.renderSetAsStartButton()}
          {this.renderSetAsEndButton()}
        </div>
      </div>
    );
  }

  render() {
    return <div class="noi-map-popup" ref={(el) => this.popupElement= el as HTMLElement}>
      {noiStore.selectedId ? this.renderSelectedStationPopup() : null}
    </div>
  }

}