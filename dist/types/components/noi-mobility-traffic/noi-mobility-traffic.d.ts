export declare class NoiMobilityTraffic {
  private strings;
  element: HTMLElement;
  highwayPoints: Array<{
    coordinates: {
      lat: any;
      long: any;
    };
    id: any;
    name: any;
  }>;
  showSearch: boolean;
  componentWillLoad(): Promise<void>;
  componentDidLoad(): Promise<void>;
  getHighwayCircles(highwayStations: Array<{
    id: any;
    coordinates: {
      lat: any;
      long: any;
    };
  }>): any[];
  getAllLinkStations(linkStations: any): any;
  render(): any;
}
