import { FunctionalComponent } from '../../../../stencil-public-runtime';
import { Marker } from 'leaflet';
import { NoiHighwayStation } from '../../../../api';
import { Selectable, WithStartEnd } from '../../../../utils';
export declare type MapMarkerProps = WithStartEnd<Selectable<NoiHighwayStation>>;
export declare const MAP_ENTITY_MARKER = "MAP_ENTITY_MARKER";
export declare const MARKER_SIZE = 10;
export declare const MapMarker: FunctionalComponent<MapMarkerProps>;
export declare function highlightMarker(e: any): void;
export declare function unHighlightMarker(e: any): void;
export declare function renderMarkerElement(e: Element): Marker;