export declare class PathDetails {
  startId: string;
  endId: string;
  segmentsTime: {
    [id: string]: number;
  };
  activePath: 'highway' | 'urban';
  highwayTimeMin: number;
  urbanTimeMin: number;
  componentDidLoad(): Promise<void>;
  updateStartStop(_: any, oldValue: any): Promise<void>;
  updateState(): Promise<void>;
  onActivatePath(value: 'highway' | 'urban'): void;
  render(): any;
}
