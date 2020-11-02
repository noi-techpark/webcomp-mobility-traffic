export const NOI_ERR_UNKNOWN = 'noi.error.unknown';
export const NOI_ERR_NO_LOCALE = 'noi.error.no-locale';
export class NoiError extends Error {
  constructor(code, options = {}) {
    super(options.message ? options.message : code);
    this.code = code;
    this.options = options;
    // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.name = NoiError.name; // stack traces display correctly now
  }
}
