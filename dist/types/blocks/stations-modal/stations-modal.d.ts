import { EventEmitter } from '../../stencil-public-runtime';
export declare class StationsModal {
  visible: boolean;
  selecting: 'start' | 'end';
  overlayIndex: number;
  modalClose: EventEmitter<{
    stationId: string;
  }>;
  searchText: string;
  hostClass: {
    slideIn?: boolean;
    slideOut?: boolean;
  };
  onVisibleChange(newValue: any): void;
  onClose(): void;
  getTitle(): string;
  onSearchChange(value: CustomEvent<{
    value: string;
  }>): void;
  private stationSelectedToggle;
  private onSelectStation;
  renderStations(): any[];
  getHostClass(visible: boolean): {
    slideIn: boolean;
    slideOut?: undefined;
  } | {
    slideOut: boolean;
    slideIn?: undefined;
  } | {
    slideIn?: undefined;
    slideOut?: undefined;
  };
  render(): any;
}
