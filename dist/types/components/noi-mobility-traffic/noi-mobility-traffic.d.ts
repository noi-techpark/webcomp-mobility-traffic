import { NoiBTStation, NoiHighwayStation } from '../../utils/api';
export declare class NoiMobilityTraffic {
  private strings;
  element: HTMLElement;
  btStations: Array<NoiBTStation>;
  highwayStations: Array<NoiHighwayStation>;
  highwayLine: Array<[number, number]>;
  componentWillLoad(): Promise<void>;
  componentDidLoad(): Promise<void>;
  getBtMarkers(): any[];
  getHighwayCircles(): any[];
  render(): any;
}
