import { FunctionalComponent } from '../../../../stencil-public-runtime';
import { CircleMarker } from 'leaflet';
import { NoiHighwayStation } from '../../../../utils/api';
interface MapHighwayStationProps extends NoiHighwayStation {
}
export declare const MAP_ENTITY_HIGHWAY_STATION = "HighwayStation";
export declare const MapHighwayStation: FunctionalComponent<MapHighwayStationProps>;
export declare function renderHighwayStationElement(e: Element): CircleMarker;
export {};
