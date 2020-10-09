interface LayerObserver {
  layer: any;
  observer: MutationObserver;
}
export declare class NoiMap {
  map: any;
  userMarker: any;
  observer: MutationObserver;
  children: WeakMap<any, LayerObserver>;
  el: HTMLElement;
  lat: number;
  long: number;
  scale: number;
  userLat: number;
  userLong: number;
  componentDidLoad(): void;
  disconnectedCallback(): void;
  latHandler(newValue: number, _oldValue: number): void;
  longHandler(newValue: number, _oldValue: number): void;
  scaleHandler(newValue: number, _oldValue: number): void;
  userLatHandler(newValue: number, _oldValue: number): void;
  userLongHandler(newValue: number, _oldValue: number): void;
  updateUserMarker(): void;
  attributesObserver(el: any, mutationsList: Array<any>): void;
  childrenObserver(mutationsList: Array<any>): void;
  getIcon(el: any): any;
  removeChildren(nodes: Array<any>): void;
  private renderMarker;
  private renderMapEntity;
  private getHighwayStationLayer;
  private renderGeoJson;
  setChildren(): void;
  updateCenterAndZoom(): void;
}
export {};
