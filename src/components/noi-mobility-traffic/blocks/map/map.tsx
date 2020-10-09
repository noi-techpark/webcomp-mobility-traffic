import { Component, Prop, Watch, Element  } from '@stencil/core';
import { CircleMarker, Browser, TileLayer, Map, GeoJSON } from 'leaflet';
import { highlightHighwayStation, MAP_ENTITY_HIGHWAY_STATION, renderHighwayStationElement, unHighlightHighwayStation } from './map-entity';

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
    
    // TODO: create a factory
    if (type === MAP_ENTITY_HIGHWAY_STATION) {
      const layer = renderHighwayStationElement(e);
      layer.on({
        mouseover: highlightHighwayStation,
        mouseout: unHighlightHighwayStation,
        click: (e) => {
          const latLong = (e.target as CircleMarker).getLatLng();
          this.map.setView(latLong, this.scale);
        }
      });
      const observer = new MutationObserver((mutations: Array<any>, _observer: any) => this.entityAttrsObserver(e, mutations));
      observer.observe(e, { attributes: true, childList: false, subtree: false });
      this.entityChildren.set(e, {layer, observer});
      layer.addTo(this.map);
      if (e.textContent) {
        layer.bindPopup(e.textContent).openPopup();
      }
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

}