export declare class NoiMobilityTraffic {
  private strings;
  private resizeObserver;
  private stationsModalEl;
  private searchEl;
  element: HTMLElement;
  showSearch: boolean;
  componentWillLoad(): Promise<void>;
  componentDidLoad(): Promise<void>;
  disconnectedCallback(): void;
  applyMediaClasses(widthPx: number, heightPx: number): void;
  getHighwayCircles(): any[];
  getPathCircles(): any[];
  getHighwayMarkers(): any[];
  getAllLinkStations(linkStations: any): any;
  onModalClose(): void;
  render(): any;
}
