import { FunctionalComponent } from '../../../../stencil-public-runtime';
import { NoiHighwayStation } from '../../../../utils/api';
interface MapHighwayStationProps extends NoiHighwayStation {
  selected?: boolean;
}
export declare const MapHighwayStation: FunctionalComponent<MapHighwayStationProps>;
export {};
