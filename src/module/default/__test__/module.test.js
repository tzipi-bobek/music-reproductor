const { initDefaultModule } = require('../module');

const app = jest.fn();

const controller = {
  configureRoutes: jest.fn(),
};

const container = {
  get: jest.fn(() => controller),
};

test('Default module gets initialized correctly', () => {
  initDefaultModule(app, container);

  expect(container.get).toHaveBeenCalledTimes(1);
  expect(container.get).toHaveBeenCalledWith('DefaultController');

  expect(controller.configureRoutes).toHaveBeenCalledTimes(1);
  expect(controller.configureRoutes).toHaveBeenCalledWith(app);
});
