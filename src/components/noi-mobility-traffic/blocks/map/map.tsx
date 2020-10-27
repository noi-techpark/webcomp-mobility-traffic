import { Component, Element, Prop, Watch, h, State } from '@stencil/core';
import noiStore from '@noi/store';
import { translate } from '@noi/lang';
import { GeoJSON, Map, TileLayer } from 'leaflet';

import { MapEntity, MapEntityFactory } from './map-entity-factory';

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
  entityFactory: MapEntityFactory;
  userMarker: any = null;
  childrenObserver: MutationObserver = null;
  entityChildren: WeakMap<any, LayerObserver<MapEntity>> = new WeakMap();
  pathChildren: WeakMap<any, LayerObserver<GeoJSON>> = new WeakMap();
  popupElement!: HTMLElement;
  popupTimer = null;

  @State() showPopup: boolean = false;
  @Element() el: HTMLElement;
  @Prop({ mutable: true }) lat: number = 46.4983;
  @Prop({ mutable: true }) long: number = 11.3548;
  @Prop({ mutable: true }) scale: number = 13;

  componentDidLoad() {
    this.map = new Map(this.el, { zoomControl: false });
    this.entityFactory = new MapEntityFactory(this.map);
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
    if (isNotAssigned(newValue)) {
      return;
    }
    this.updateCenterAndZoom();
  }

  @Watch('long')
  longHandler(newValue: number, _oldValue: number): void {
    if (isNotAssigned(newValue)) {
      return;
    }
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
    const layer = this.entityFactory.createLayer(e);
    const observer = new MutationObserver((mutations: Array<any>, _observer: any) => this.entityAttrsObserver(e, mutations));
    observer.observe(e, { attributes: true, childList: false, subtree: false });
    this.entityChildren.set(e, {layer, observer});
    layer.addTo(this.map);
    layer.bindPopup(this.popupElement, {minWidth: 350});
    layer.getPopup().on('remove', () => noiStore.selectedId = '');
  }

  private renderGeoJson(e: Element) {
    const geometry = JSON.parse(e.getAttribute('geometry'));
    const layer = new GeoJSON(geometry, {
      style: {
        className: 'noi-map-path',
      }, 
    });
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


  /**
   * dirty hack to avoid popup container blinking with empty content,
   * popup container should only be shown (with 1s CSS animation) if the content is rendered.
   * inverse for hiding, popup content should only be destroyed, when popup container finished hiding 1s CSS animation
   */
  updatePopupVisibility(visible: boolean) {
    clearTimeout(this.popupTimer);
    if (!visible) {
      this.popupTimer = window.setTimeout(() => {
        this.showPopup = false;
        clearTimeout(this.popupTimer);
      }, 1000);
    } else {
      this.popupTimer = window.setTimeout(() => {
        this.showPopup = true;
        clearTimeout(this.popupTimer);
      }, 500);
    }
  }

  renderSetAsStartButton() {
    if (noiStore.selectedId === noiStore.startId) {
      return null;
    }
    return (
      <noi-button fill="solid" class="button-md station-popup__btn" onClick={this.onSetAsStart.bind(this)}>
        {translate('map-popup.from')}
      </noi-button>
    );
  }

  renderSetAsEndButton() {
    if (noiStore.selectedId === noiStore.endId) {
      return null;
    }
    return (
      <noi-button fill="solid" class="button-md station-popup__btn" onClick={this.onSetAsEnd.bind(this)}>
        {translate('map-popup.to')}
      </noi-button>
    );
  }

  renderSelectedStationPopup() {
    return (
      <div class="station-popup">
        <div class="station-popup__header">{noiStore.selectedId ? noiStore.selected.name : ''}</div>
        <div class="station-popup__content">
          {this.renderSetAsStartButton()}
          {this.renderSetAsEndButton()}
        </div>
      </div>
    );
  }

  render() {
    console.log('map render');
    const popupClass = {
      'map-popup-container': true,
      'map-popup-container--visible': this.showPopup
    };
    this.updatePopupVisibility(!!noiStore.selectedId);
    return <div class={popupClass} ref={(el) => this.popupElement= el as HTMLElement}>
      {noiStore.selectedId || this.showPopup ? this.renderSelectedStationPopup() : null}
    </div>
  }

}