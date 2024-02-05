const { initAlbumModule } = require('../module');

const app = jest.fn();

const controller = {
  configureRoutes: jest.fn(),
};

const container = {
  get: jest.fn(() => controller),
};

test('Album module gets initialized correctly', () => {
  initAlbumModule(app, container);

  expect(container.get).toHaveBeenCalledTimes(1);
  expect(container.get).toHaveBeenCalledWith('AlbumController');

  expect(controller.configureRoutes).toHaveBeenCalledTimes(1);
  expect(controller.configureRoutes).toHaveBeenCalledWith(app);
});
