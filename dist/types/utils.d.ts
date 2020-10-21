export declare type Selectable<T> = T & {
  selected?: boolean;
};
export declare type WithStartEnd<T> = T & {
  isStart?: boolean;
  isEnd?: boolean;
};
/**
 * getting a valid token should be not concurrent, so if one token request is being processed,
 * another one should wait, in order not to send multiple "login" or "refresh" requests to thew auth server
 */
export declare const notConcurrent: <T>(proc: () => PromiseLike<T>) => () => Promise<T>;
export declare const fnDebounce: (wait: number, fn: (...params: any[]) => any) => (this: any, ...args: any[]) => number;
export declare function formatDuration(valueMin: number): string;
export interface NoiCoordinate {
  lat: number;
  long: number;
}
export declare type HasCoordinates<Q extends {
  coordinates: NoiCoordinate;
}> = Array<Q>;
export declare function getAround<T extends {
  coordinates: NoiCoordinate;
}>(points: HasCoordinates<T>, center: NoiCoordinate, distanceMeters: number): HasCoordinates<T>;
export declare function getClosestTo<T extends {
  coordinates: NoiCoordinate;
}>(points: HasCoordinates<T>, center: NoiCoordinate): T;
export declare function getDistance<Q extends {
  coordinates: NoiCoordinate;
}>(from: Q, center: NoiCoordinate): number;
export declare function getPointsDistance(from: [number, number], to: [number, number]): number;
