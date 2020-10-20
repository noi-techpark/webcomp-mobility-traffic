export declare class Search {
  durationMin: number;
  hostClass: {
    slideIn?: boolean;
    slideOut?: boolean;
  };
  getStart(): string;
  getEnd(): string;
  onInputClick(what: 'start' | 'end'): void;
  onReorderClick(): void;
  onToggleActive(): void;
  renderDetails(): any;
  renderFooter(): any;
  render(): any;
}
