export declare const NOI_ERR_UNKNOWN = "noi.error.unknown";
export declare type NoiErrorOptions = 'actionCode' | 'message' | 'error';
export declare type NoiErrorOptionsObject = {
  [option in NoiErrorOptions]?: any;
};
export declare class NoiError extends Error {
  code: string;
  options: NoiErrorOptionsObject;
  constructor(code: string, options?: NoiErrorOptionsObject);
}