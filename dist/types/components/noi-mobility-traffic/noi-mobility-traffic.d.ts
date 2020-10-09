import { NoiHighwayStation } from '../../utils/api';
export declare class NoiMobilityTraffic {
  private strings;
  private resizeObserver;
  element: HTMLElement;
  highwayPoints: Array<NoiHighwayStation>;
  showSearch: boolean;
  componentWillLoad(): Promise<void>;
  componentDidLoad(): Promise<void>;
  disconnectedCallback(): void;
  applyMediaClasses(widthPx: number, heightPx: number): void;
  getHighwayCircles(highwayStations: Array<NoiHighwayStation>): any[];
  getAllLinkStations(linkStations: any): any;
  render(): any;
}
