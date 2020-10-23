import { NoiHighwayStation } from '@noi/api';
import { FunctionalComponent, h } from '@stencil/core';
import { CircleMarker, FillRule, Browser } from 'leaflet';
import { Selectable, WithStartEnd } from 'src/utils';

export type MapStationProps = WithStartEnd<Selectable<NoiHighwayStation>>;

export const MAP_ENTITY_STATION = 'MAP_ENTITY_STATION';
const STATION_CIRCLE_RADIUS = 12;

export const MapStation: FunctionalComponent<MapStationProps> = (props) => {
  const entityClass = {
    'noi-highway-station': true,
    'noi-highway-station--selected': props.selected,
    'noi-highway-station--start': props.isStart,
    'noi-highway-station--end': props.isEnd,
  };
  return (
    <noi-map-entity
      entity-type={MAP_ENTITY_STATION}
      entity-id={props.id}
      lat={props.coordinates.lat}
      long={props.coordinates.long}
      class={entityClass}
      style={{display: 'none'}}>
        {props.id}-{props.name}
    </noi-map-entity>
  );
}

export function highlightHighwayStation(e) {
  const layer: CircleMarker = e.target;
  layer.getElement().classList.add('noi-highway-station--hover');
  if (!Browser.ie && !Browser.opera && !Browser.edge) {
    layer.bringToFront();
  }
}

export function unHighlightHighwayStation(e) {
  const layer: CircleMarker = e.target;
  layer.getElement().classList.remove('noi-highway-station--hover');

}

export function renderHighwayStationElement(e: Element): CircleMarker {
  const lat: number = +e.getAttribute('lat');
  const long: number = +e.getAttribute('long');
  const opts = {
    radius: STATION_CIRCLE_RADIUS,
    fill: true,
    fillRule: 'nonzero' as FillRule,
    className: e.getAttribute('class'),
    bubblingMouseEvents: false
  };

  return new CircleMarker([lat, long], opts);
}
