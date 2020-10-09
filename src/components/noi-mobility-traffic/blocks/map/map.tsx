import { Component, Prop, Watch, Element  } from '@stencil/core';
import L from 'leaflet';
import { MAP_ENTITY_HIGHWAY_STATION } from './map-entity';

interface LayerObserver {
  layer: any,
  observer: MutationObserver,
}

function isNotAssigned(value: any) {
  return value === undefined || value === null || isNaN(value);
}

const USER_ICON_URL = ''; // TODO:
const ICON_HEIGHT = 32;
const ICON_WIDTH = 32;
const HIGHWAY_STATION_CIRCLE_RADIUS = 10;
const HIGHWAY_STATION_CIRCLE_STROKE = 1;
const TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

@Component({
  tag: 'noi-map',
  styleUrl: 'map.css'
})
export class NoiMap {
  map: any = null;
  userMarker: any = null;
  observer: MutationObserver = null;
  children: WeakMap<any, LayerObserver> = new WeakMap();

  @Element() el: HTMLElement;

  @Prop({ mutable: true }) lat: number = 46.4983;
  @Prop({ mutable: true }) long: number = 11.3548;
  @Prop({ mutable: true }) scale: number = 13;
  @Prop({ mutable: true }) userLat: number = 0;
  @Prop({ mutable: true }) userLong: number = 0;

  componentDidLoad() {
    this.map = L.map(this.el, { zoomControl: false });
    this.updateCenterAndZoom();
    L.tileLayer(TILE_LAYER).addTo(this.map);
    this.setChildren();
    this.updateUserMarker();

    this.observer = new MutationObserver((mutations: Array<any>, _observer: any) => this.childrenObserver(mutations));
    this.observer.observe(this.el, { attributes: false, childList: true, subtree: false });
  }

  disconnectedCallback() {
    this.observer.disconnect();
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

  @Watch('userLat')
  userLatHandler(newValue: number, _oldValue: number): void {
    this.userLat = newValue;
    this.updateUserMarker();
  }

  @Watch('userLong')
  userLongHandler(newValue: number, _oldValue: number): void {
    this.userLong = newValue;
    this.updateUserMarker();
  }

  updateUserMarker() {
    if (isNotAssigned(this.userLat) || isNotAssigned(this.userLong)) {
      if (this.userMarker) {
        this.map.removeLayer(this.userMarker);
        this.userMarker = null;
      }
      return;
    }
    if (!this.userMarker) {
      this.userMarker = L.marker([this.userLat, this.userLong]);
      const icon = L.icon({
        iconUrl: USER_ICON_URL,
        iconSize: [ICON_WIDTH, ICON_HEIGHT]
      });
      this.userMarker.setIcon(icon);
      this.userMarker.addTo(this.map);
    } else {
      this.userMarker.setLatLng([this.userLat, this.userLong]);
    }
  }

  attributesObserver(el: any, mutationsList: Array<any>) : void {
    for (const mutation of mutationsList) {
      if (mutation.type !== 'attributes')  continue;

      if (['latitude', 'longitude'].includes(mutation.attributeName)) {
        this.children.get(el).layer.setLatLng([el.getAttribute('latitude'), el.getAttribute('longitude')]);
      }

      if (['icon-height', 'icon-url', 'icon-width'].includes(mutation.attributeName)) {
        const icon = this.getIcon(el);

        this.children.get(el).layer.setIcon(icon);
      }
    }
  }

  childrenObserver(mutationsList: Array<any>): void {
    for (const mutation of mutationsList) {
      if (mutation.type !== 'childList') continue;
      this.removeChildren(mutation.removedNodes);
      this.setChildren();
    }
  }

  getIcon(el: any) {
    return L.icon({
      iconUrl: el.getAttribute('icon-url'),
      iconSize: [el.getAttribute('icon-width') || 32, el.getAttribute('icon-height') || 32]
    });
  }

  removeChildren(nodes: Array<any>) {
    nodes.forEach(node => {
      if (!node.nodeName.startsWith("NOI-")) return;

      const el = this.children.get(node);
      this.map.removeLayer(el.layer);
      if (el.observer) el.observer.disconnect();
      this.children.delete(node);
    });
  }

  private renderMarker(e: Element, observeProps = false) {
    if (e.nodeName !== 'LEAFLET-MARKER') {
      return;
    }
    const observer = observeProps ? new MutationObserver((mutations: Array<any>, _observer: any) => this.attributesObserver(e, mutations)) : null;
    observer && observer.observe(e, { attributes: true, childList: false, subtree: false });
    const marker = {
      layer: L.marker([e.getAttribute('latitude'), e.getAttribute('longitude')]),
      observer,
    }
    this.children.set(e, marker);
    marker.layer.addTo(this.map);

    if (e.textContent) {
      marker.layer.bindPopup(e.textContent).openPopup();
    }
    if (e.getAttribute('icon-url')) {
      const icon = this.getIcon(e)
      marker.layer.setIcon(icon);
    }
  }

  private renderMapEntity(e: Element) {
    const type: string = e.getAttribute('entity-type');
    if (type === MAP_ENTITY_HIGHWAY_STATION) {
      const layer = this.getHighwayStationLayer(e);
      this.children.set(e, layer);
      layer.addTo(this.map);
    }
  }

  private getHighwayStationLayer(e: Element): any {
    const lat: number = +e.getAttribute('lat');
    const long: number = +e.getAttribute('long');
    // FIXME: pass the theme attributes via class, leave the radius and stroke const
    const opts = {
      radius: HIGHWAY_STATION_CIRCLE_RADIUS,
      stroke: HIGHWAY_STATION_CIRCLE_STROKE,
      color: '#5b879f',
      opacity: 1.0,
      fill: true,
      fillColor: '#88b2ca',
      fillOpacity: 0.8,
      fillRule: 'nonzero',
      bubblingMouseEvents: e.hasAttribute('bubbling-mouse-events'),
    };

    const circle = L.circleMarker([lat, long], opts);
    if (e.textContent) {
      circle.bindPopup(e.textContent).openPopup();
    }
    return circle;
  }

  private renderGeoJson(e: Element) {
    if (e.nodeName !== 'NOI-ROUTE') {
      return;
    }
    const geometry = JSON.parse(e.getAttribute('geometry'));
    const line = L.geoJSON(geometry, geometry);

    this.children.set(e, line);
    line.addTo(this.map);
  }

  setChildren(): void {
    Array.from(this.el.children).map(e => {
      if (this.children.get(e) !== undefined) {
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
          debugger;
          break;
      }
    });
  }

  updateCenterAndZoom(): void {
    this.map.setView([this.lat, this.long], this.scale);
  }

}