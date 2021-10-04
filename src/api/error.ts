export const NOI_ERR_UNKNOWN = 'error.unknown';
export const NOI_ERR_NO_LOCALE = 'error.no-locale';

export type NoiErrorOptions =
  'actionCode' |
  'message' |
  'error';

export type NoiErrorOptionsObject = {[option in NoiErrorOptions]?: any};

export class NoiError extends Error {
  constructor(public code: string, public options: NoiErrorOptionsObject = {}) {
    super(options.message ? options.message : code);
    // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.name = NoiError.name; // stack traces display correctly now
  }
}
