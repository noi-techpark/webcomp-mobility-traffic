import { NoiPathRenderer, NoiPoint } from "./path";
export declare type NoiPathElement = 'M' | 'S' | 'T' | 'L' | 'C' | [number, number];
export declare class NoiLeafletCurvePath implements NoiPathRenderer {
  private value;
  getValue(): NoiPathElement[];
  moveTo(to: NoiPoint): void;
  cubicTo(control1: NoiPoint, control2: NoiPoint, to: NoiPoint): void;
  lineTo(to: NoiPoint): void;
  finish(to: NoiPoint): void;
  cubicWithPrevTo(control: NoiPoint, to: NoiPoint): void;
}
