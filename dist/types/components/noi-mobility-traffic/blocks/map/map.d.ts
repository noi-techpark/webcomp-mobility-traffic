import { CircleMarker, Map, GeoJSON } from 'leaflet';
interface LayerObserver<T> {
  layer: T;
  observer: MutationObserver;
}
export declare class NoiMap {
  map: Map;
  userMarker: any;
  childrenObserver: MutationObserver;
  entityChildren: WeakMap<any, LayerObserver<CircleMarker>>;
  pathChildren: WeakMap<any, LayerObserver<GeoJSON>>;
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
}
export {};
