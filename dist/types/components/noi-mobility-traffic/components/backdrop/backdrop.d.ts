import { ComponentInterface, EventEmitter } from '../../../../stencil-public-runtime';
export declare class Backdrop implements ComponentInterface {
  overlayIndex: number;
  visible: boolean;
  tappable: boolean;
  stopPropagation: boolean;
  noiBackdropTap: EventEmitter<void>;
  protected onMouseDown(ev: TouchEvent): void;
  private emitTap;
  render(): any;
}
