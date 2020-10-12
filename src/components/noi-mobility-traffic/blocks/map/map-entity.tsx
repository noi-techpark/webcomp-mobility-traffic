import { FunctionalComponent, h } from '@stencil/core';
import { CircleMarker, FillRule, Browser } from 'leaflet';
import { NoiHighwayStation } from '../../../../api';
import { Selectable } from '../../../../utils';

export type MapHighwayStationProps = Selectable<NoiHighwayStation>;

export const MAP_ENTITY_HIGHWAY_STATION = 'HighwayStation';
const HIGHWAY_STATION_CIRCLE_RADIUS = 10;


export const MapHighwayStation: FunctionalComponent<MapHighwayStationProps> = (props) => (
  <noi-map-entity
    entity-type={MAP_ENTITY_HIGHWAY_STATION}
    entity-id={props.id}
    lat={props.coordinates.lat}
    long={props.coordinates.long}
    class={props.selected ? "noi-highway-station-selected": "noi-highway-station"}
    style={{display: 'none'}}>
      {props.id}-{props.name}
  </noi-map-entity>
);

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
    radius: HIGHWAY_STATION_CIRCLE_RADIUS,
    fill: true,
    fillRule: 'nonzero' as FillRule,
    className: e.getAttribute('class'),
    bubblingMouseEvents: false
  };

  return new CircleMarker([lat, long], opts);
}