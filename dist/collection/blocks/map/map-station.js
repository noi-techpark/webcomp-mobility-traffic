import { h } from '@stencil/core';
import { CircleMarker, Browser } from 'leaflet';
export const MAP_ENTITY_STATION = 'MAP_ENTITY_STATION';
const STATION_CIRCLE_RADIUS = 12;
export const MapStation = (props) => {
  const entityClass = {
    'noi-highway-station': true,
    'noi-highway-station--selected': props.selected,
    'noi-highway-station--start': props.isStart,
    'noi-highway-station--end': props.isEnd,
  };
  return (h("noi-map-entity", { "entity-type": MAP_ENTITY_STATION, "entity-id": props.id, lat: props.coordinates.lat, long: props.coordinates.long, class: entityClass, style: { display: 'none' } },
    props.id,
    "-",
    props.name));
};
export function highlightHighwayStation(e) {
  const layer = e.target;
  layer.getElement().classList.add('noi-highway-station--hover');
  if (!Browser.ie && !Browser.opera && !Browser.edge) {
    layer.bringToFront();
  }
}
export function unHighlightHighwayStation(e) {
  const layer = e.target;
  layer.getElement().classList.remove('noi-highway-station--hover');
}
export function renderHighwayStationElement(e) {
  const lat = +e.getAttribute('lat');
  const long = +e.getAttribute('long');
  const opts = {
    radius: STATION_CIRCLE_RADIUS,
    fill: true,
    fillRule: 'nonzero',
    className: e.getAttribute('class'),
    bubblingMouseEvents: false
  };
  return new CircleMarker([lat, long], opts);
}
