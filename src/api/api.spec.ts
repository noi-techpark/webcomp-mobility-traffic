
import { NOI_SERVICE_ERR_UNKNOWN, NOI_SERVICE_ERR_OFFLINE, OpenDataHubNoiService } from './api';
import { NoiError } from './error';

const URL_500 = 'http://httpstat.us/500';
const URL_TIMEOUT = 'http://httpstat.us/522';

function mockFetchPromise(url: string): Promise<Partial<Response>>  {
  if (url === URL_500) {
    return Promise.resolve({status: 500, ok: false})
  }
  if (url === URL_TIMEOUT) {
    return Promise.reject({})
  }
}

describe('api', () => {
  let api;

  beforeAll(() => {
    api = new OpenDataHubNoiService();
    global.fetch = jest.fn().mockImplementation((url: string) => mockFetchPromise(url));
  })

  afterAll(() => {
    global.fetch['mockClear']();
    delete global.fetch;
  })

  it('api returns NoiError on error', async () => {
    try {
      await api.request(URL_500)
    } catch (error: any) {
      expect(error instanceof NoiError).toEqual(true);
    }
  });

  it('api returns "error.noi-service.offline" on timeout', async () => {
    try {
      await api.request(URL_TIMEOUT)
    } catch (error: any) {
      expect(error.code).toEqual(NOI_SERVICE_ERR_OFFLINE);
    }
  });

  it('api returns "error.noi-service.unknown" on Internal Server Error', async () => {
    try {
      await api.request(URL_500)
    } catch (error: any) {
      expect(error.code).toEqual(NOI_SERVICE_ERR_UNKNOWN);
    }
  });

});
