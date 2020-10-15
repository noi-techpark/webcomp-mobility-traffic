import { BaseIconOptions, Icon } from 'leaflet';
export interface SvgIconOptions extends BaseIconOptions {
  viewBox?: string;
}
export interface SvgPathIconOptions extends SvgIconOptions {
  path?: string;
  pathTransform?: string;
}
export declare class SvgPathIcon extends Icon<SvgPathIconOptions> {
  constructor(options: SvgPathIconOptions);
  createIcon(oldIcon: any): HTMLDivElement;
  adjustDivPosition(divEl: HTMLDivElement): void;
}
