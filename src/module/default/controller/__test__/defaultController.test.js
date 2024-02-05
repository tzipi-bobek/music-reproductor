const bootstrapTests = require('../../../../__test__/test.init');
// eslint-disable-next-line no-unused-vars
const DefaultController = require('../defaultController');

let container = null;
/**
 * @type {DefaultController}
 */
let controller = null;
let res = null;
let req = null;

beforeEach(async () => {
  container = await bootstrapTests();
  controller = container.get('DefaultController');
  res = {
    render: jest.fn(),
  };
  req = {};
});

describe('Default Controller', () => {
  test('index action', async () => {
    await controller.index(req, res);
    expect(res.render).toHaveBeenCalledTimes(1);
  });

  test('Configures routes', () => {
    const app = {
      get: jest.fn(),
    };
    controller.configureRoutes(app);
    expect(app.get).toHaveBeenCalledTimes(1);
  });
});
