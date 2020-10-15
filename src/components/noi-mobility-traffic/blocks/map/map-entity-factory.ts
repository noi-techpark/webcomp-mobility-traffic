import { CircleMarker, LatLng, LatLngExpression, Layer, Map, Marker } from 'leaflet';

import noiStore from '../../../../store';
import { highlightMarker, MAP_ENTITY_MARKER, renderMarkerElement, unHighlightMarker } from './map-marker';
import {
  highlightHighwayStation,
  MAP_ENTITY_STATION,
  renderHighwayStationElement,
  unHighlightHighwayStation,
} from './map-station';

export interface MapEntity extends Layer {
  getLatLng(): LatLng;
  setLatLng(latLng: LatLngExpression): MapEntity;
  getElement(): Element;
}

export class MapEntityFactory {
  constructor (private map: Map) {
  }

  public createLayer(e: Element): MapEntity {
    const type: string = e.getAttribute('entity-type');
    if (type === MAP_ENTITY_STATION) {
      return this.createStation(e)
    }
    if (type === MAP_ENTITY_MARKER) {
      return this.createMarker(e)
    }
  }


  private createStation(e: Element) {
    const id: string = e.getAttribute('entity-id');
    const result = renderHighwayStationElement(e);
    result.on({
      mouseover: highlightHighwayStation,
      mouseout: unHighlightHighwayStation,
      click: (e) => {
        const latLong = (e.target as CircleMarker).getLatLng();
        this.map.panTo(latLong);
        noiStore.selectedId = id;
      }
    });
    return result;
  }

  private createMarker(e: Element) {
    const id: string = e.getAttribute('entity-id');
    const result = renderMarkerElement(e);
    result.on({
      mouseover: highlightMarker,
      mouseout: unHighlightMarker,
      click: (e) => {
        const latLong = (e.target as Marker).getLatLng();
        this.map.panTo(latLong);
        noiStore.selectedId = id;
      }
    });
    return result;
  }
}