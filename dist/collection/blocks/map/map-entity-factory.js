import noiStore from '@noi/store';
import { highlightMarker, MAP_ENTITY_MARKER, renderMarkerElement, unHighlightMarker } from './map-marker';
import { highlightHighwayStation, MAP_ENTITY_STATION, renderHighwayStationElement, unHighlightHighwayStation, } from './map-station';
export class MapEntityFactory {
  constructor(map) {
    this.map = map;
  }
  createLayer(e) {
    const type = e.getAttribute('entity-type');
    if (type === MAP_ENTITY_STATION) {
      return this.createStation(e);
    }
    if (type === MAP_ENTITY_MARKER) {
      return this.createMarker(e);
    }
  }
  createStation(e) {
    const id = e.getAttribute('entity-id');
    const result = renderHighwayStationElement(e);
    result.on({
      mouseover: highlightHighwayStation,
      mouseout: unHighlightHighwayStation,
      click: (e) => {
        const latLong = e.target.getLatLng();
        this.map.panTo(latLong);
        noiStore.selectedId = id;
        noiStore.mapPopup = true;
      }
    });
    return result;
  }
  createMarker(e) {
    const id = e.getAttribute('entity-id');
    const result = renderMarkerElement(e);
    result.on({
      mouseover: highlightMarker,
      mouseout: unHighlightMarker,
      click: (e) => {
        const latLong = e.target.getLatLng();
        this.map.panTo(latLong);
        noiStore.selectedId = id;
        noiStore.mapPopup = true;
      }
    });
    return result;
  }
}
