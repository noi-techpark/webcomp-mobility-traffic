export class NoiPoint {
  private value: [number, number]
  
  constructor(value: [number, number]) {
    this.value = [...value];
  }

  public getValue() {
    return this.value;
  }

  public get x() {
    return this.value[1];
  }

  public get y() {
    return this.value[0];
  }

  public plus(factor: number, ePointF: NoiPoint): NoiPoint {
    return new NoiPoint([this.y + factor * ePointF.y, this.x + factor * ePointF.x]);
  }

  public plusPoint(ePointF: NoiPoint): NoiPoint {
    return this.plus(1, ePointF);
  }

  public minus(factor: number, ePointF: NoiPoint): NoiPoint {
    return new NoiPoint([this.y - factor * ePointF.y, this.x - factor * ePointF.x]);
  }

  public minusPoint(ePointF: NoiPoint): NoiPoint {
    return this.minus(1, ePointF);
  }

  public scaleBy(factor: number): NoiPoint {
    return new NoiPoint([factor * this.y, factor * this.x]);
  }
};

export type NoiPointArray = Array<NoiPoint>;

export interface NoiPathRenderer {
  moveTo(to: NoiPoint): void;
  cubicTo(control1: NoiPoint, control2: NoiPoint, to: NoiPoint): void;
  lineTo(to: NoiPoint): void;
  finish(to: NoiPoint): void;
  cubicWithPrevTo(control: NoiPoint, to: NoiPoint): void;
}

export function parseKnots(value: Array<[number, number]>) {
  return value.map(i => new NoiPoint(i));
}

function getDistance(a: [number, number], b: [number, number]): number {
  return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
}

function lengthChunkArray<T>(value: Array<T>, chunkSize: number): Array<Array<T>> {
  const result = [];
  for (let i = 0; i < value.length; i += chunkSize) {
    result.push(value.slice(i , i + chunkSize));
  }
  return result;
}


export function computePathThroughKnots(input: Array<[number, number]>, pathRenderer: NoiPathRenderer): void {
  if (!input || input.length < 2) {
    throw new Error('Path should be at least 2 points long!')
  }
  const distanceChunks = distanceChunkArray(input, 0.4);
  const chunks = distanceChunks.map(chunk => lengthChunkArray(chunk, 5)).reduce((acc, val) => acc.concat(val), []);
  chunks.forEach((chunk, i) => {
    if (!chunk || chunk.length < 2) {
      throw new Error('Chunk should be at least 2 points long!')
    }
    const knots = parseKnots(chunk);
    const firstKnot = knots[0];
    if (i === 0) {
      pathRenderer.moveTo(firstKnot);
    } else {
      pathRenderer.lineTo(firstKnot);
    }
    // variable representing the number of Bezier curves we will join together
    const n = knots.length - 1;
    if (n === 1) {
      const lastKnot = knots[1];
      pathRenderer.lineTo(lastKnot);
    } else {
      const controlPoints = computeControlPoints(n, knots);
      for (let i = 0; i < n; i++) {
        const targetKnot = knots[i + 1];
        pathRenderer.cubicTo(controlPoints[i], controlPoints[n + i], targetKnot);
      }
    }
  });
}

function distanceChunkArray(value: Array<[number, number]>, precision = 0.3): Array<Array<[number,number]>> {
  const distanceChunks = value.reduce((result, i) => {
    if (!result.prev && !result.chunks.length) {
      result.prev = i;
      result.chunks.push([i]);
      result.distance = 0;
      return result;
    }
    const distance = getDistance(i, result.prev);
    if (!result.distance) {
      result.prev = i;
      result.chunks[result.chunks.length-1].push(i);
      result.distance = distance;
      return result;
    }
    const diff = Math.abs(result.distance - distance);
    if (diff > result.distance * precision) {
      const newChunk = [[...result.prev], i];
      result.chunks.push(newChunk);
      result.prev = i;
      result.distance = distance;
      return result;
    }
    result.prev = i;
    result.chunks[result.chunks.length-1].push(i);
    return result;
  }, {chunks: [], prev: null, distance: 0}).chunks;
  return distanceChunks;
}


function computeControlPoints(n: number, knots: NoiPointArray): NoiPointArray {
  const result: NoiPointArray = new Array(2 * n);
  const target = constructTargetVector(n, knots);
  const lowerDiag: Array<number> = constructLowerDiagonalVector(n - 1);
  const mainDiag: Array<number> = constructMainDiagonalVector(n);
  const upperDiag: Array<number> = constructUpperDiagonalVector(n - 1);

  const newTarget: NoiPointArray = new Array(n);
  const newUpperDiag: Array<number> = new Array(n - 1);

  // forward sweep for control points c_i,0:
  newUpperDiag[0] = upperDiag[0] / mainDiag[0];
  newTarget[0] = target[0].scaleBy(1 / mainDiag[0]);

  for (let i = 1; i < n - 1; i++) {
    newUpperDiag[i] = upperDiag[i] / (mainDiag[i] - lowerDiag[i - 1] * newUpperDiag[i - 1]);
  }

  for (let i = 1; i < n; i++) {
    const targetScale = 1 / (mainDiag[i] - lowerDiag[i - 1] * newUpperDiag[i - 1]);
    newTarget[i] = target[i].minusPoint(
        newTarget[i - 1].scaleBy(lowerDiag[i - 1])
    ).scaleBy(targetScale);
  }

  // backward sweep for control points c_i,0:
  result[n - 1] = newTarget[n - 1];

  for (let i = n - 2; i >= 0; i--) {
    result[i] = newTarget[i].minus(newUpperDiag[i], result[i + 1]);
  }

  // calculate remaining control points c_i,1 directly:
  for (let i = 0; i < n - 1; i++) {
    result[n + i] = knots[i + 1].scaleBy(2).minusPoint(result[i + 1]);
  }

  result[2 * n - 1] = knots[n].plusPoint(result[n - 1]).scaleBy(0.5);

  return result;
}

function  constructTargetVector(n: number, knots: NoiPointArray): NoiPointArray {
  const result: NoiPointArray = new Array(n);
  result[0] = knots[0].plus(2, knots[1]);
  for (let i = 1; i < n - 1; i++) {
    result[i] = (knots[i].scaleBy(2).plusPoint(knots[i + 1])).scaleBy(2);
  }
  result[result.length - 1] = knots[n - 1].scaleBy(8).plusPoint(knots[n]);
  return result;
}


function constructLowerDiagonalVector(length: number): Array<number> {
  const result = new Array(length);
  result.fill(1)
  result[result.length - 1] = 2;
  return result;
}

function constructMainDiagonalVector(n: number): Array<number> {
  const result = new Array(n);
  result.fill(4)
  result[0] = 2;
  result[result.length - 1] = 7;
  return result;
}

function constructUpperDiagonalVector(length: number): Array<number> {
  const result = new Array(length);
  result.fill(1);
  return result;
}
