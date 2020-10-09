import { NoiHighwayStation } from '../../utils/api';
import { Selectable } from './blocks/map/map-entity';
export declare class NoiMobilityTraffic {
  private strings;
  private resizeObserver;
  element: HTMLElement;
  highwayPoints: Array<Selectable<NoiHighwayStation>>;
  showSearch: boolean;
  onSelectBrenner(): void;
  onUnSelectBrenner(): void;
  componentWillLoad(): Promise<void>;
  componentDidLoad(): Promise<void>;
  disconnectedCallback(): void;
  applyMediaClasses(widthPx: number, heightPx: number): void;
  getHighwayCircles(highwayStations: Array<NoiHighwayStation>): any[];
  getAllLinkStations(linkStations: any): any;
  render(): any;
}
