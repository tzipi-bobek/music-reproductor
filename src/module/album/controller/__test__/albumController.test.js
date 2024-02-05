const AlbumController = require('../albumController');
const createTestAlbum = require('./album.fixture');

const serviceMock = {
  save: jest.fn(),
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestAlbum(id + 1))),
  getById: jest.fn((id) => createTestAlbum(id)),
  getAlbumsLength: jest.fn(() => 3),
  getLastAlbum: jest.fn(() => createTestAlbum(3)),
  delete: jest.fn(),
};

const uploadMock = {
  single: jest.fn(),
};

const reqMock = {
  params: { albumId: 1 },
};
const resMock = {
  render: jest.fn(),
  redirect: jest.fn(),
};

const mockController = new AlbumController(serviceMock, uploadMock);

describe('AlbumController methods', () => {
  afterEach(() => {
    Object.values(serviceMock).forEach((mockFn) => mockFn.mockClear());
    Object.values(resMock).forEach((mockFn) => mockFn.mockClear());
  });

  test('configures routes for every method', () => {
    const app = {
      get: jest.fn(),
    };
    mockController.configureRoutes(app);
    expect(app.get).toHaveBeenCalledTimes(3);
  });

  test('index renders index.njk with overall data and last added album', async () => {
    const albumsLength = serviceMock.getAlbumsLength();
    const lastAddedAlbum = serviceMock.getLastAlbum();
    await mockController.index(reqMock, resMock);

    expect(serviceMock.getLastAlbum).toHaveBeenCalledTimes(2);
    expect(serviceMock.getAlbumsLength).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('album/views/index.njk', {
      title: 'Last Album Added',
      albumsLength,
      lastAddedAlbum,
    });
  });

  test('index handles exception when getting the last added album', async () => {
    serviceMock.getLastAlbum.mockImplementationOnce(() => {
      throw new Error('Error getting the last album');
    });

    await mockController.index(reqMock, resMock);

    expect(serviceMock.getLastAlbum).toHaveBeenCalledTimes(1);

    expect(resMock.render).toHaveBeenCalledWith('album/views/index.njk', {
      title: 'Last Album Added',
      albumsLength: serviceMock.getAlbumsLength(),
      lastAddedAlbum: null,
    });
  });

  test('manage renders manage.njk with a list of albums', async () => {
    const albums = serviceMock.getAll();
    await mockController.manage(reqMock, resMock);

    expect(serviceMock.getAll).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('album/views/manage.njk', {
      title: 'Albums List',
      albums,
    });
  });

  test('view renders view.njk with a single album and its songs', async () => {
    const album = serviceMock.getById(1);
    await mockController.view(reqMock, resMock);

    expect(serviceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('album/views/view.njk', {
      title: 'Viewing Lover by Taylor Swift 2023',
      album,
      songs: album.songs,
    });
  });

  test('view throws an error on undefined albumId as argument', async () => {
    const reqMockWithoutAlbumId = {
      params: {},
    };

    const nextMock = jest.fn();

    await mockController.view(reqMockWithoutAlbumId, resMock, nextMock);

    expect(nextMock).toHaveBeenCalledTimes(1);
  });

  test('deletes an existing album', async () => {
    await mockController.delete(reqMock, resMock);

    expect(serviceMock.delete).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  });
});
