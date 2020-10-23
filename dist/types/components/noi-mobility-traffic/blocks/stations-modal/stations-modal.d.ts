import { EventEmitter } from '../../../../stencil-public-runtime';
export declare class StationsModal {
  visible: boolean;
  selecting: 'start' | 'end';
  overlayIndex: number;
  modalClose: EventEmitter<{
    stationId: string;
  }>;
  searchText: string;
  onClose(): void;
  getTitle(): string;
  onSearchChange(value: CustomEvent<{
    value: string;
  }>): void;
  private stationSelectedToggle;
  private onSelectStation;
  renderStations(): any[];
  render(): any;
}
