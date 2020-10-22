import { NoiLinkStation } from '../api';
export interface NoiPathState {
  startId: string;
  endId: string;
  path: Array<NoiLinkStation>;
  readonly loading: boolean;
  readonly errorCode: string;
  readonly stations: Array<{
    position: number;
    id: string;
    name: string;
  }>;
  readonly durationMin: number;
  readonly distance: number;
}
export declare const urbanPathState: NoiPathState;
