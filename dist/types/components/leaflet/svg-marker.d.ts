import { BaseIconOptions, Icon, Point } from 'leaflet';
export interface SvgIconOptions extends BaseIconOptions {
  viewBox?: string;
}
export interface SvgPathIconOptions extends SvgIconOptions {
  path?: string;
}
export declare class SvgPathIcon extends Icon<SvgPathIconOptions> {
  constructor(options: SvgPathIconOptions);
  createIcon(oldIcon: any): HTMLDivElement;
  createShadow(): HTMLDivElement;
  setPosition(divEl: HTMLDivElement, size?: Point, anchor?: Point): void;
}
