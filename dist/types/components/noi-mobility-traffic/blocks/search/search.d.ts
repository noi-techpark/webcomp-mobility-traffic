export declare class Search {
  durationMin: number;
  getStart(): string;
  getEnd(): string;
  onInputClick(what: 'start' | 'end'): void;
  onReorderClick(): void;
  render(): any;
}
