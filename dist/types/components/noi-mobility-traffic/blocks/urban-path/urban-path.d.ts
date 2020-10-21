import { NoiLinkStation } from '@noi/api';
export declare class UrbanPathDetails {
  startId: string;
  endId: string;
  urbanPath: string[];
  errorCode: string;
  urbanStations: NoiLinkStation[];
  segments: {
    name: string;
    position: number;
  }[];
  render(): any;
}
