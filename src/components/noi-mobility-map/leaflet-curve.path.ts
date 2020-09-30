import { NoiPathRenderer, NoiPoint } from "./path";

export type NoiPathElement = 'M' | 'S' | 'T' | 'L' | 'C' | [number, number];

export class NoiLeafletCurvePath implements NoiPathRenderer {
  private value: Array<NoiPathElement> = [];

  public getValue() {
    return [...this.value];
  }

  public moveTo(to: NoiPoint) {
    this.value.push('M', to.getValue());
  }

  public cubicTo(control1: NoiPoint, control2: NoiPoint, to: NoiPoint) {
    this.value.push('C', control1.getValue(), control2.getValue(), to.getValue());
  }

  public lineTo(to: NoiPoint) {
    this.value.push('L', to.getValue());
  }

  public finish(to: NoiPoint) {
    this.value.push('T', to.getValue());
  }

  public cubicWithPrevTo(control: NoiPoint, to: NoiPoint) {
    this.value.push('S', control.getValue(), to.getValue());
  }
}
