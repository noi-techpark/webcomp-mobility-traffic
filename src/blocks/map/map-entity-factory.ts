import { CircleMarker, LatLng, LatLngExpression, Layer, Map, Marker } from 'leaflet';
import noiStore from '@noi/store';

import { highlightMarker, MAP_ENTITY_MARKER, renderMarkerElement, unHighlightMarker } from './map-marker';
import {
  highlightHighwayStation,
  MAP_ENTITY_HIGHWAY_STATION,
  renderHighwayStationElement,
  unHighlightHighwayStation,
} from './map-station';
import { MAP_ENTITY_URBAN_STATION, renderUrbanStationElement } from './map-urban-station';
import { urbanPathState } from '@noi/store/urban-path.store';

export interface MapEntity extends Layer {
  getLatLng(): LatLng;
  setLatLng(latLng: LatLngExpression): MapEntity;
  getElement(): Element;
  canSelect?: boolean;
}

export type Selectable<T> = T & {canSelect?: boolean};

export class MapEntityFactory {
  constructor (private map: Map) {
  }

  public createLayer(e: Element): MapEntity {
    const type: string = e.getAttribute('entity-type');
    if (type === MAP_ENTITY_HIGHWAY_STATION) {
      return this.createHighwayStation(e)
    }
    if (type === MAP_ENTITY_URBAN_STATION) {
      return this.createUrbanStation(e)
    }
    if (type === MAP_ENTITY_MARKER) {
      return this.createMarker(e)
    }
  }


  private createHighwayStation(e: Element) {
    const id: string = e.getAttribute('entity-id');
    const result: Selectable<CircleMarker> = renderHighwayStationElement(e);
    result.canSelect = true;
    result.on({
      mouseover: highlightHighwayStation,
      mouseout: unHighlightHighwayStation,
      click: (e) => {
        const latLong = (e.target as CircleMarker).getLatLng();
        this.map.panTo(latLong);
        noiStore.selectedId = id;
        noiStore.mapPopup = true;
      }
    });
    return result;
  }

  private createUrbanStation(e: Element) {
    const id: string = e.getAttribute('entity-id');
    const result: Selectable<CircleMarker> = renderUrbanStationElement(e);
    result.canSelect = false;
    result.on({
      mouseover: highlightHighwayStation,
      mouseout: unHighlightHighwayStation,
      click: (e) => {
        const latLong = (e.target as CircleMarker).getLatLng();
        this.map.panTo(latLong);
        urbanPathState.selectedId = id;
        noiStore.mapPopup = true;
      }
    });
    return result;
  }

  private createMarker(e: Element) {
    const id: string = e.getAttribute('entity-id');
    const result: Selectable<Marker> = renderMarkerElement(e);
    result.canSelect = true;
    result.on({
      mouseover: highlightMarker,
      mouseout: unHighlightMarker,
      click: (e) => {
        const latLong = (e.target as Marker).getLatLng();
        this.map.panTo(latLong);
        noiStore.selectedId = id;
        noiStore.mapPopup = true;
      }
    });
    return result;
  }
}