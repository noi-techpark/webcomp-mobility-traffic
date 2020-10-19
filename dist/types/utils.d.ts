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
