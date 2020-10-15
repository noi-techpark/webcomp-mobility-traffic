import { GeoJSON, Map } from 'leaflet';
import { MapEntity, MapEntityFactory } from './map-entity-factory';
interface LayerObserver<T> {
  layer: T;
  observer: MutationObserver;
}
export declare class NoiMap {
  map: Map;
  entityFactory: MapEntityFactory;
  userMarker: any;
  childrenObserver: MutationObserver;
  entityChildren: WeakMap<any, LayerObserver<MapEntity>>;
  pathChildren: WeakMap<any, LayerObserver<GeoJSON>>;
  popupElement: HTMLElement;
  el: HTMLElement;
  lat: number;
  long: number;
  scale: number;
  componentDidLoad(): void;
  disconnectedCallback(): void;
  latHandler(newValue: number, _oldValue: number): void;
  longHandler(newValue: number, _oldValue: number): void;
  scaleHandler(newValue: number, _oldValue: number): void;
  entityAttrsObserver(el: any, mutationsList: Array<any>): void;
  childrenObserverCallback(mutationsList: Array<any>): void;
  removeChildren(nodes: Array<any>): void;
  private renderMapEntity;
  private renderGeoJson;
  renderChildren(): void;
  updateCenterAndZoom(): void;
  onSetAsStart(): void;
  onSetAsEnd(): void;
  renderSetAsStartButton(): any;
  renderSetAsEndButton(): any;
  renderSelectedStationPopup(): any;
  render(): any;
}
export {};
