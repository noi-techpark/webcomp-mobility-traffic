export type Selectable<T> = T & {selected?: boolean};

export type WithStartEnd<T> = T & {isStart?: boolean, isEnd?: boolean};

/**
 * getting a valid token should be not concurrent, so if one token request is being processed,
 * another one should wait, in order not to send multiple "login" or "refresh" requests to thew auth server
 */
export const notConcurrent = <T>(proc: () => PromiseLike<T>) => {
  let inFlight: Promise<T> | false = false;

  return () => {
    if (!inFlight) {
      inFlight = (async () => {
        try {
          return await proc();
        } finally {
          inFlight = false;
        }
      })();
    }
    return inFlight;
  };
};

export const fnDebounce = (wait: number, fn: (...params: any[]) => any) => {
  let timer: number | undefined = undefined;
  return function (this: any, ...args: any[]) {
    if (timer === undefined) {
      fn.apply(this, args);
    }
    clearTimeout(timer);
    timer = window.setTimeout(() => fn.apply(this, args), wait);
    return timer;
  }
};