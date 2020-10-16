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
  popupTimer: any;
  showPopup: boolean;
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
  /**
   * dirty hack to avoid popup container blinking with empty content,
   * popup container should only be shown (with 1s CSS animation) if the content is rendered.
   * inverse for hiding, popup content should only be destroyed, when popup container finished hiding 1s CSS animation
   */
  updatePopupVisibility(visible: boolean): void;
  renderSetAsStartButton(): any;
  renderSetAsEndButton(): any;
  renderSelectedStationPopup(): any;
  render(): any;
}
export {};
