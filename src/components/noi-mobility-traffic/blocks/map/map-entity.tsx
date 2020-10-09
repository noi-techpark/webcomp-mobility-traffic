import { FunctionalComponent, h } from '@stencil/core';
import L, { CircleMarker, FillRule } from 'leaflet';
import { NoiHighwayStation } from '../../../../utils/api';

interface MapHighwayStationProps extends NoiHighwayStation {
}

export const MAP_ENTITY_HIGHWAY_STATION = 'HighwayStation';
const HIGHWAY_STATION_CIRCLE_RADIUS = 10;


export const MapHighwayStation: FunctionalComponent<MapHighwayStationProps> = (props) => (
  <noi-map-entity
    entity-type={MAP_ENTITY_HIGHWAY_STATION}
    entity-id={props.id}
    lat={props.coordinates.lat}
    long={props.coordinates.long}
    class="noi-highway-station"
    style={{display: 'none'}}>
  </noi-map-entity>
);

export function renderHighwayStationElement(e: Element): CircleMarker {
  const lat: number = +e.getAttribute('lat');
  const long: number = +e.getAttribute('long');
  const opts = {
    radius: HIGHWAY_STATION_CIRCLE_RADIUS,
    fill: true,
    fillRule: 'nonzero' as FillRule,
    className: e.getAttribute('class'),
    bubblingMouseEvents: false
  };

  return L.circleMarker([lat, long], opts);
}