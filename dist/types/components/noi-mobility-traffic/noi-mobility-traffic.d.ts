import { NoiLinkStation } from '../../utils/api';
export declare class NoiMobilityTraffic {
  private strings;
  element: HTMLElement;
  linkStations: Array<NoiLinkStation>;
  showSearch: boolean;
  componentWillLoad(): Promise<void>;
  componentDidLoad(): Promise<void>;
  getHighwayCircles(highwayStations: any): any;
  getAllLinkStations(linkStations: any): any;
  render(): any;
}
