import { EventEmitter } from '../../../../stencil-public-runtime';
export declare class PathDetails {
  startId: string;
  endId: string;
  segmentsTime: {
    [id: string]: number;
  };
  activePath: 'highway' | 'urban';
  highwayTimeMin: number;
  toggleActive: EventEmitter<void>;
  componentDidLoad(): Promise<void>;
  updateStart(_: any, oldValue: any): Promise<void>;
  updateStop(_: any, oldValue: any): Promise<void>;
  updateState(): Promise<void>;
  onActivatePath(value: 'highway' | 'urban'): void;
  render(): any;
}
