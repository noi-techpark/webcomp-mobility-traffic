import { NoiBTStation } from '../../utils/api';
export declare class NoiMobilityTraffic {
  private strings;
  element: HTMLElement;
  stations: Array<NoiBTStation>;
  componentWillLoad(): Promise<void>;
  componentDidLoad(): Promise<void>;
  getMarkers(): any[];
  render(): any;
}
