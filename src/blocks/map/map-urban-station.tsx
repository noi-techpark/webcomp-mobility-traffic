import { FunctionalComponent, h } from '@stencil/core';
import { CircleMarker, FillRule, Browser } from 'leaflet';
import { NoiCoordinate, Selectable } from '@noi/utils';

export type MapUrbanStationProps = Selectable<{position: number; id: string; name: string; coordinates: NoiCoordinate}>;

export const MAP_ENTITY_URBAN_STATION = 'MAP_ENTITY_URBAN_STATION';
const STATION_CIRCLE_RADIUS = 8;

export const MapUrbanStation: FunctionalComponent<MapUrbanStationProps> = (props) => {
  const entityClass = {
    'noi-urban-station': true,
    'noi-urban-station--selected': props.selected,
  };
  return (
    <noi-map-entity
      key={props.id}
      entity-type={MAP_ENTITY_URBAN_STATION}
      entity-id={props.id}
      lat={props.coordinates.lat}
      long={props.coordinates.long}
      class={entityClass}
      style={{display: 'none'}}>
        {props.id}-{props.name}
    </noi-map-entity>
  );
}

export function highlightUrbanStation(e) {
  const layer: CircleMarker = e.target;
  layer.getElement().classList.add('noi-urban-station--hover');
  if (!Browser.ie && !Browser.opera && !Browser.edge) {
    layer.bringToFront();
  }
}

export function unHighlightUrbanStation(e) {
  const layer: CircleMarker = e.target;
  layer.getElement().classList.remove('noi-urban-station--hover');

}

export function renderUrbanStationElement(e: Element): CircleMarker {
  const lat: number = +e.getAttribute('lat');
  const long: number = +e.getAttribute('long');
  const opts = {
    radius: STATION_CIRCLE_RADIUS,
    fill: true,
    fillRule: 'nonzero' as FillRule,
    className: e.getAttribute('class'),
    bubblingMouseEvents: false,
  };

  return new CircleMarker([lat, long], opts);
}
