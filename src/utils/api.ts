import { NoiError, NoiErrorOptionsObject } from "./error";

export const NOI_SERVICE_ERR_UNKNOWN = 'noi-service.err.unknown';

export function getErrByServiceError(err: Error): NoiError {
  // TODO: implement error codes handling from service
  return new NoiError(NOI_SERVICE_ERR_UNKNOWN);
}

export interface NoiErrorService {
  show(errCode: string, options?: NoiErrorOptionsObject);
  showError(error: NoiError);
}

export interface NoiService {
}
