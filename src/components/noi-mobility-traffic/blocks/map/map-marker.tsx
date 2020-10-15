import { FunctionalComponent, h } from '@stencil/core';
import { Marker, MarkerOptions } from 'leaflet';
import { NoiHighwayStation } from '../../../../api';
import { SvgPathIcon } from '../../../../leaflet/svg-marker';
import { Selectable, WithStartEnd } from '../../../../utils';

export type MapMarkerProps = WithStartEnd<Selectable<NoiHighwayStation>>;

export const MAP_ENTITY_MARKER = 'MAP_ENTITY_MARKER';
export const MARKER_SIZE = 10;

export const MapMarker: FunctionalComponent<MapMarkerProps> = (props) => {
  const entityClass = {
    'noi-marker': true,
    'noi-marker--selected': props.selected,
    'noi-marker--start': props.isStart,
    'noi-marker--end': props.isEnd,
  };
  return (
    <noi-map-entity
      entity-type={MAP_ENTITY_MARKER}
      entity-id={props.id}
      lat={props.coordinates.lat}
      long={props.coordinates.long}
      class={entityClass}
      style={{display: 'none'}}>
        {props.id}-{props.name}
    </noi-map-entity>
  );
}

export function highlightMarker(e) {
  const layer: Marker = e.target;
  layer.getElement().classList.add('noi-marker--hover');
}

export function unHighlightMarker(e) {
  const layer: Marker = e.target;
  layer.getElement().classList.remove('noi-marker--hover');

}

export function renderMarkerElement(e: Element): Marker {
  const lat: number = +e.getAttribute('lat');
  const long: number = +e.getAttribute('long');
  const icon = new SvgPathIcon({className: e.getAttribute('class'),});
  const opts: MarkerOptions = {
    icon,
  };
  return new Marker([lat, long], opts);
}
