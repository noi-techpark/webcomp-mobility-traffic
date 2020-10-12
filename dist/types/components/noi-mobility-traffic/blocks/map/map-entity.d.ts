import { FunctionalComponent } from '../../../../stencil-public-runtime';
import { CircleMarker } from 'leaflet';
import { NoiHighwayStation } from '../../../../api';
import { Selectable } from '../../../../utils';
export declare type MapHighwayStationProps = Selectable<NoiHighwayStation>;
export declare const MAP_ENTITY_HIGHWAY_STATION = "HighwayStation";
export declare const MapHighwayStation: FunctionalComponent<MapHighwayStationProps>;
export declare function highlightHighwayStation(e: any): void;
export declare function unHighlightHighwayStation(e: any): void;
export declare function renderHighwayStationElement(e: Element): CircleMarker;
