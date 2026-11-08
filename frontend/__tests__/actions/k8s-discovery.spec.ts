import * as k8sActions from '../../public/actions/k8s';
import { getResources as getResources_ } from '../../public/module/k8s/get-resources';
import { fetchSwagger } from '../../public/module/k8s';

jest.mock('../../public/module/k8s/get-resources', () => ({
  getResources: jest.fn(),
  cacheResources: jest.fn(),
}));

jest.mock('../../public/module/k8s', () => ({
  ...jest.requireActual('../../public/module/k8s'),
  fetchSwagger: jest.fn(() => Promise.resolve({})),
}));

const getResourcesMock = getResources_ as jest.Mock;
const fetchSwaggerMock = fetchSwagger as jest.Mock;

const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

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
