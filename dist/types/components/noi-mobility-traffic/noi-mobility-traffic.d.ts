export declare class NoiMobilityTraffic {
  private strings;
  private resizeObserver;
  private stationsModal;
  element: HTMLElement;
  showSearch: boolean;
  onSelectBrenner(): void;
  onUnSelectBrenner(): void;
  componentWillLoad(): Promise<void>;
  componentDidLoad(): Promise<void>;
  disconnectedCallback(): void;
  applyMediaClasses(widthPx: number, heightPx: number): void;
  getHighwayCircles(): any[];
  getAllLinkStations(linkStations: any): any;
  onModalClose(): void;
  render(): any;
}
