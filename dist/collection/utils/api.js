import { NoiError } from "./error";
export const NOI_SERVICE_ERR_UNKNOWN = 'noi-service.err.unknown';
export function getErrByServiceError(err) {
  // TODO: implement error codes handling from service
  return new NoiError(NOI_SERVICE_ERR_UNKNOWN);
}
