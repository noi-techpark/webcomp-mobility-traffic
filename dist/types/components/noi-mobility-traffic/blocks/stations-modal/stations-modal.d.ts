import { EventEmitter } from '../../../../stencil-public-runtime';
export declare class StationsModal {
  visible: boolean;
  selecting: 'start' | 'end';
  overlayIndex: number;
  modalClose: EventEmitter<{
    stationId: string;
  }>;
  onClose(): void;
  getTitle(): "Selezionare la partenza" | "Selezionare la destinazione";
  renderStations(): any[];
  render(): any;
}
