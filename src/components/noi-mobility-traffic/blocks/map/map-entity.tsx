import { FunctionalComponent, h } from '@stencil/core';
import { NoiHighwayStation } from '../../../../utils/api';

interface MapHighwayStationProps extends NoiHighwayStation {
}

export const MAP_ENTITY_HIGHWAY_STATION = 'HighwayStation';

export const MapHighwayStation: FunctionalComponent<MapHighwayStationProps> = (props) => (
  <noi-map-entity
    entity-type={MAP_ENTITY_HIGHWAY_STATION}
    entity-id={props.id}
    lat={props.coordinates.lat}
    long={props.coordinates.long}
    style={{display: 'none'}}>
  </noi-map-entity>
);