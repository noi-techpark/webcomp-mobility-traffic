import { LatLng, LatLngExpression, Layer, Map } from 'leaflet';
export interface MapEntity extends Layer {
  getLatLng(): LatLng;
  setLatLng(latLng: LatLngExpression): MapEntity;
  getElement(): Element;
}
export declare class MapEntityFactory {
  private map;
  constructor(map: Map);
  createLayer(e: Element): MapEntity;
  private createStation;
  private createMarker;
}
