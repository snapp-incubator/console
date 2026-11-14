import * as k8sActions from '../../public/actions/k8s';
import { getResources as getResources_ } from '../../public/module/k8s/get-resources';
import { fetchSwagger } from '../../public/module/k8s/swagger';

jest.mock('../../public/module/k8s/get-resources', () => ({
  getResources: jest.fn(),
  cacheResources: jest.fn(),
}));

jest.mock('../../public/module/k8s/swagger', () => ({
  fetchSwagger: jest.fn(() => Promise.resolve({})),
}));

const getResourcesMock = (getResources_ as unknown) as jest.Mock;
const fetchSwaggerMock = (fetchSwagger as unknown) as jest.Mock;

const flushPromises = () => new Promise((resolve) => setImmediate(resolve));
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// These run first and use real timers: lodash's debounce reads Date.now(), which this Jest
// version's fake timers do not advance.
describe('getResources OpenAPI refresh', () => {
  beforeEach(() => {
    getResourcesMock.mockReset();
    getResourcesMock.mockImplementation(() => Promise.resolve({ models: [] }));
    fetchSwaggerMock.mockClear();
  });

  it('does not refresh OpenAPI definitions after the initial discovery run', async () => {
    k8sActions.getResources(false)(jest.fn());
    await sleep(k8sActions.SWAGGER_REFRESH_DELAY + 500);
    expect(fetchSwaggerMock).not.toHaveBeenCalled();
  }, 20000);

  it('refreshes OpenAPI definitions after later discovery runs', async () => {
    k8sActions.getResources()(jest.fn());
    await sleep(k8sActions.SWAGGER_REFRESH_DELAY + 500);
    expect(fetchSwaggerMock).toHaveBeenCalledTimes(1);
  }, 20000);
});

describe('getResources', () => {
  beforeEach(() => {
    getResourcesMock.mockReset();
    fetchSwaggerMock.mockClear();
  });

  it('coalesces discovery requests made while one is in flight', async () => {
    const pending = [];
    getResourcesMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          pending.push(resolve);
        }),
    );
    const dispatch = jest.fn();

    k8sActions.getResources()(dispatch);
    k8sActions.getResources()(dispatch);
    k8sActions.getResources()(dispatch);
    expect(getResourcesMock).toHaveBeenCalledTimes(1);

    // Finishing the first run starts exactly one follow-up run for the requests it absorbed.
    pending[0]({ models: [] });
    await flushPromises();
    expect(getResourcesMock).toHaveBeenCalledTimes(2);

    pending[1]({ models: [] });
    await flushPromises();
    expect(getResourcesMock).toHaveBeenCalledTimes(2);
  });
});
