import { coFetchJSON } from '../../../public/co-fetch';
import { fetchSwagger, getSwaggerDefinitions } from '../../../public/module/k8s/swagger';

jest.mock('../../../public/co-fetch', () => ({
  coFetchJSON: jest.fn(),
}));

const coFetchJSONMock = coFetchJSON as jest.Mock;

Object.defineProperty(window, 'localStorage', {
  value: { removeItem: jest.fn() },
  writable: true,
});

describe('fetchSwagger', () => {
  beforeEach(() => {
    coFetchJSONMock.mockReset();
  });

  it('shares one request between concurrent callers', async () => {
    const definitions = { 'io.k8s.api.core.v1.Pod': { description: 'Pod' } };
    let resolve: (value: any) => void;
    coFetchJSONMock.mockReturnValue(
      new Promise((r) => {
        resolve = r;
      }),
    );

    const first = fetchSwagger();
    const second = fetchSwagger();
    resolve({ definitions });

    expect(await first).toBe(definitions);
    expect(await second).toBe(definitions);
    expect(coFetchJSONMock).toHaveBeenCalledTimes(1);
    expect(getSwaggerDefinitions()).toBe(definitions);
  });

  it('fetches again once the previous request has finished', async () => {
    coFetchJSONMock.mockImplementation(() => Promise.resolve({ definitions: {} }));

    await fetchSwagger();
    await fetchSwagger();

    expect(coFetchJSONMock).toHaveBeenCalledTimes(2);
  });

  it('allows a new request after a failed one', async () => {
    coFetchJSONMock.mockImplementationOnce(() => Promise.reject(new Error('boom')));
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(await fetchSwagger()).toBeNull();

    coFetchJSONMock.mockImplementationOnce(() => Promise.resolve({ definitions: {} }));
    expect(await fetchSwagger()).toEqual({});
    expect(coFetchJSONMock).toHaveBeenCalledTimes(2);
  });
});
