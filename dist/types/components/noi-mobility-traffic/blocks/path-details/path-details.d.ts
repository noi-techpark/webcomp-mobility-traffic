export declare class PathDetails {
  segmentsTime: {
    [id: string]: number;
  };
  activePath: 'highway' | 'urban';
  highwayTimeMin: number;
  urbanTimeMin: number;
  componentDidLoad(): Promise<void>;
  onActivatePath(value: 'highway' | 'urban'): void;
  render(): any;
}
