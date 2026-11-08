import { fetchSwagger, getSwaggerDefinitions } from '@console/internal/module/k8s';
import { FLAG_KUBEVIRT } from '../const';
import { detectKubevirtVirtualMachines } from '../detect-kubevirt-virtual-machines';

jest.mock('@console/internal/module/k8s', () => ({
  fetchSwagger: jest.fn(),
  getSwaggerDefinitions: jest.fn(),
}));

const fetchSwaggerMock = (fetchSwagger as unknown) as jest.Mock;
const getSwaggerDefinitionsMock = (getSwaggerDefinitions as unknown) as jest.Mock;

const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

describe('detectKubevirtVirtualMachines', () => {
  const originalSetInterval = window.setInterval;
  let setIntervalMock: jest.Mock;

  beforeEach(() => {
    fetchSwaggerMock.mockReset();
    getSwaggerDefinitionsMock.mockReset();
    setIntervalMock = jest.fn(() => 1);
    window.setInterval = setIntervalMock as any;
  });

  afterEach(() => {
    window.setInterval = originalSetInterval;
  });

  it('fetches OpenAPI definitions only when none are loaded yet', async () => {
    const definitions = { 'io.kubevirt.v1.VirtualMachine': { properties: {} } };
    getSwaggerDefinitionsMock.mockImplementationOnce(() => undefined);
    getSwaggerDefinitionsMock.mockImplementation(() => definitions);
    fetchSwaggerMock.mockImplementation(() => Promise.resolve(definitions));
    const setFeatureFlag = jest.fn();

    await detectKubevirtVirtualMachines(setFeatureFlag);
    await flushPromises();
    expect(fetchSwaggerMock).toHaveBeenCalledTimes(1);
    expect(setFeatureFlag).toHaveBeenCalledWith(FLAG_KUBEVIRT, true);

    // Later ticks reuse the definitions the console keeps up to date.
    const tick = setIntervalMock.mock.calls[0][0];
    tick();
    tick();
    await flushPromises();
    expect(fetchSwaggerMock).toHaveBeenCalledTimes(1);
    expect(getSwaggerDefinitionsMock).toHaveBeenCalledTimes(3);
  });
});
