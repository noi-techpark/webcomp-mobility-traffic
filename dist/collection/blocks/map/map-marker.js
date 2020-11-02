import { h } from '@stencil/core';
import { SvgPathIcon } from '@noi/components/leaflet/svg-marker';
import { Marker } from 'leaflet';
export const MAP_ENTITY_MARKER = 'MAP_ENTITY_MARKER';
export const MARKER_SIZE = 10;
export const MapMarker = (props) => {
  const entityClass = {
    'noi-marker': true,
    'noi-marker--selected': props.selected,
    'noi-marker--start': props.isStart,
    'noi-marker--end': props.isEnd,
  };
  return (h("noi-map-entity", { "entity-type": MAP_ENTITY_MARKER, "entity-id": props.id, lat: props.coordinates.lat, long: props.coordinates.long, class: entityClass, style: { display: 'none' } },
    props.id,
    "-",
    props.name));
};
export function highlightMarker(e) {
  const layer = e.target;
  layer.getElement().classList.add('noi-marker--hover');
}
export function unHighlightMarker(e) {
  const layer = e.target;
  layer.getElement().classList.remove('noi-marker--hover');
}
export function renderMarkerElement(e) {
  const lat = +e.getAttribute('lat');
  const long = +e.getAttribute('long');
  const icon = new SvgPathIcon({ className: e.getAttribute('class'), });
  const opts = {
    icon,
  };
  return new Marker([lat, long], opts);
}
