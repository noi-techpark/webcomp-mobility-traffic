import '../../utils/leaflet-curve';
interface LayerObserver {
  layer: any;
  observer: any;
}
export declare class LeafletMarker {
  lmap: any;
  dmarker: any;
  userMarker: any;
  observer: any;
  children: WeakMap<any, LayerObserver>;
  el: HTMLElement;
  tileLayer: string;
  iconUrl: string;
  iconHeight: number;
  iconWidth: number;
  latitude: number;
  longitude: number;
  scale: number;
  showScale: boolean;
  showDefaultMarker: boolean;
  defaultPopup: string;
  userLatitude: number;
  userLongitude: number;
  userIconUrl: string;
  userIconWidth: number;
  userIconHeight: number;
  componentDidLoad(): void;
  disconnectedCallback(): void;
  defaultPopupHandler(newValue: string, _oldValue: string): void;
  iconHeightHandler(newValue: number, _oldValue: number): void;
  iconUrlHandler(newValue: string, _oldValue: string): void;
  iconWidthHandler(newValue: number, _oldValue: number): void;
  latitudeHandler(newValue: number, _oldValue: number): void;
  longitudeHandler(newValue: number, _oldValue: number): void;
  scaleHandler(newValue: number, _oldValue: number): void;
  userLatitudeHandler(newValue: number, _oldValue: number): void;
  userLongitudeHandler(newValue: number, _oldValue: number): void;
  userIconUrlHandler(newValue: string, _oldValue: string): void;
  userIconWidthHandler(newValue: number, _oldValue: number): void;
  userIconHeightHandler(newValue: number, _oldValue: number): void;
  updateUserMarker(): void;
  setUserMarker(): void;
  attributesObserver(el: any, mutationsList: Array<any>): void;
  childrenObserver(mutationsList: Array<any>): void;
  getIcon(el: any): any;
  removeChildren(nodes: Array<any>): void;
  private renderMarker;
  private renderCircle;
  private renderPolyline;
  private renderGeoJson;
  setChildren(): void;
  setDefaultIcon(): void;
  setDefaultMarker(): void;
  setScale(): void;
  setTileLayer(): void;
  setView(): void;
  updateDefaultMarker(): void;
  updateDefaultPopup(): void;
}
export {};
