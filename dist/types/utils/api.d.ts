import { NoiError, NoiErrorOptionsObject } from "./error";
export declare const NOI_SERVICE_ERR_UNKNOWN = "noi-service.err.unknown";
export declare function getErrByServiceError(err: Error): NoiError;
export interface NoiErrorService {
  show(errCode: string, options?: NoiErrorOptionsObject): any;
  showError(error: NoiError): any;
}
export interface NoiService {
}
