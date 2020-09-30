import { NoiBTStation, NoiHighwayStation, NoiLinkStation } from '../../utils/api';
export declare class NoiMobilityTraffic {
  private strings;
  element: HTMLElement;
  btStations: Array<NoiBTStation>;
  highwayStations: Array<NoiHighwayStation>;
  highwayLine: Array<[number, number]>;
  linkStation: NoiLinkStation;
  linkStations: Array<NoiLinkStation>;
  componentWillLoad(): Promise<void>;
  componentDidLoad(): Promise<void>;
  getBtMarkers(): any[];
  getHighwayCircles(): any[];
  getAllLinkStations(): any[];
  render(): any;
}
