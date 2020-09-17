import { NoiError, NoiErrorOptionsObject } from "./error";

export const NOI_SERVICE_ERR_UNKNOWN = 'error.noi-service.unknown';
export const NOI_SERVICE_ERR_500 = 'error.noi-service.500';
export const NOI_SERVICE_ERR_OFFLINE = 'error.noi-service.offline';
export const NOI_SERVICE_ERR_DATA_FORMAT = 'error.noi-service.data-format';

export function getErrByServiceError(error: Error): NoiError {
  console.error(error);
  return new NoiError(NOI_SERVICE_ERR_OFFLINE);
}

export function getErrByStatus(status: number): NoiError {
  // TODO: implement error codes handling from service
  if (status === 500) {
    return new NoiError(NOI_SERVICE_ERR_500);
  }
  return new NoiError(NOI_SERVICE_ERR_OFFLINE);
}

export interface NoiErrorService {
  show(errCode: string, options?: NoiErrorOptionsObject);
  showError(error: NoiError);
}

export interface NoiService {
  getTree(): Promise<any>;
}

export interface NoiTreeItem {
  id: string;
  description: string;
  urls: {
    stations: string;
    stationsDataTypes: string;
    stationsDataTypesMeasurements: string;
  }
}

class OpenDataHubNoiService implements NoiService {
  static BASE_URL = 'https://mobility.api.opendatahub.bz.it';
  static VERSION = 'v2';

  private async request(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok){
        const noiErr = getErrByStatus(response.status);
        throw noiErr;
      }
      const json = await response.json();
      return json;
    } catch (err) {
      const noiErr = getErrByServiceError(err);
      throw noiErr;
    }
  }

  async getTree(): Promise<Array<NoiTreeItem>> {
    const response = await this.request(`${OpenDataHubNoiService.BASE_URL}/${OpenDataHubNoiService.VERSION}/tree`);
    if (!Array.isArray(response)) {
      throw new NoiError(NOI_SERVICE_ERR_DATA_FORMAT, {message: 'getTree expecting and array response'});
    }
    return response;
  }
}

export const NoiAPI = new OpenDataHubNoiService();