export declare class NoiPoint {
  private value;
  constructor(value: [number, number]);
  getValue(): [number, number];
  get x(): number;
  get y(): number;
  plus(factor: number, ePointF: NoiPoint): NoiPoint;
  plusPoint(ePointF: NoiPoint): NoiPoint;
  minus(factor: number, ePointF: NoiPoint): NoiPoint;
  minusPoint(ePointF: NoiPoint): NoiPoint;
  scaleBy(factor: number): NoiPoint;
}
export declare type NoiPointArray = Array<NoiPoint>;
export declare type NoiPathElement = 'M' | 'S' | 'T' | 'L' | 'C' | [number, number];
export interface NoiPathRenderer {
  moveTo(to: NoiPoint): void;
  cubicTo(control1: NoiPoint, control2: NoiPoint, to: NoiPoint): void;
  lineTo(to: NoiPoint): void;
  finish(to: NoiPoint): void;
  cubicWithPrevTo(control: NoiPoint, to: NoiPoint): void;
}
export declare class NoiLeafletCurvePath implements NoiPathRenderer {
  private value;
  getValue(): NoiPathElement[];
  moveTo(to: NoiPoint): void;
  cubicTo(control1: NoiPoint, control2: NoiPoint, to: NoiPoint): void;
  lineTo(to: NoiPoint): void;
  finish(to: NoiPoint): void;
  cubicWithPrevTo(control: NoiPoint, to: NoiPoint): void;
}
export declare function parseKnots(value: Array<[number, number]>): NoiPoint[];
export declare function computePathThroughKnots(input: Array<[number, number]>, pathRenderer: NoiPathRenderer): void;
