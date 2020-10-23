export declare class NoiMobilityTraffic {
  private resizeObserver;
  private stationsModalEl;
  private searchEl;
  element: HTMLElement;
  showSearch: boolean;
  errorCode: string;
  loading: boolean;
  loadLocaleAndStations(): Promise<void>;
  componentDidLoad(): Promise<void>;
  disconnectedCallback(): void;
  applyMediaClasses(widthPx: number, heightPx: number): void;
  getHighwayCircles(): any[];
  getPathCircles(): any[];
  getUrbanPath(): any[];
  getHighwayMarkers(): any[];
  getAllLinkStations(linkStations: any): any;
  onModalClose(): void;
  render(): any;
}
