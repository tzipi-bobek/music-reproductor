const AlbumService = require('../albumService');
const createTestAlbum = require('../../controller/__test__/album.fixture');
const createTestSong = require('../../../song/controller/__test__/songs.fixture');
const AlbumNotDefinedError = require('../../error/AlbumNotDefinedError');
const AlbumIdNotDefinedError = require('../../error/AlbumIdNotDefinedError');

const repositoryMock = {
  save: jest.fn(),
  create: jest.fn(),
  updateAlbumAttribute: jest.fn(),
  getAlbum: jest.fn(),
  getPreviousAlbum: jest.fn(),
  updatePreviousAlbum: jest.fn(),
  updateAlbum: jest.fn(),
  getAll: jest.fn(),
  getAlbumsLength: jest.fn(),
  getLastAlbum: jest.fn(),
  getById: jest.fn(),
  getAlbumIfExistByTitle: jest.fn(),
  delete: jest.fn(),
};

const mockService = new AlbumService(repositoryMock);

describe('AlbumService methods', () => {
  test("create calls repository's create method", async () => {
    const songWithoutId = createTestSong();
    await mockService.create(songWithoutId);

    expect(repositoryMock.create).toHaveBeenCalledTimes(1);
    expect(repositoryMock.create).toHaveBeenCalledWith(songWithoutId);
  });

  test("save calls repository's save method", async () => {
    const songWithoutId = createTestSong();
    const album = await mockService.create(songWithoutId);
    await mockService.save(album);

    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    expect(repositoryMock.save).toHaveBeenCalledWith(album);
  });

  test("updateAlbumAttribute calls repository's updateAlbumAttribute method", async () => {
    const songWithoutId = createTestSong();
    const album = await mockService.create(songWithoutId);
    await mockService.updateAlbumAttribute(album, [songWithoutId]);

    expect(repositoryMock.updateAlbumAttribute).toHaveBeenCalledTimes(1);
    expect(repositoryMock.updateAlbumAttribute).toHaveBeenCalledWith(album, [songWithoutId]);
  });

  test("getAlbum calls repository's getAlbum method", async () => {
    const songWithoutId = createTestSong();
    await mockService.getAlbum(songWithoutId);

    expect(repositoryMock.getAlbum).toHaveBeenCalledTimes(1);
    expect(repositoryMock.getAlbum).toHaveBeenCalledWith(songWithoutId);
  });

  test("getPreviousAlbum calls repository's getPreviousAlbum method", async () => {
    const songWithoutId = createTestSong();
    await mockService.getPreviousAlbum(songWithoutId);

    expect(repositoryMock.getPreviousAlbum).toHaveBeenCalledTimes(1);
    expect(repositoryMock.getPreviousAlbum).toHaveBeenCalledWith(songWithoutId);
  });

  test("updatePreviousAlbum calls repository's updatePreviousAlbum method", async () => {
    const songWithoutId = createTestSong();
    const previousAlbum = await mockService.create(songWithoutId);
    const album = await mockService.create(songWithoutId);
    await mockService.updatePreviousAlbum(previousAlbum, album, [songWithoutId]);

    expect(repositoryMock.updatePreviousAlbum).toHaveBeenCalledTimes(1);
    expect(repositoryMock.updatePreviousAlbum).toHaveBeenCalledWith(previousAlbum, album, [
      songWithoutId,
    ]);
  });

  test("updateAlbum calls repository's updateAlbum method", async () => {
    const songWithoutId = createTestSong();
    const album = await mockService.create(songWithoutId);
    await mockService.updateAlbum(album, [songWithoutId]);

    expect(repositoryMock.updateAlbum).toHaveBeenCalledTimes(1);
    expect(repositoryMock.updateAlbum).toHaveBeenCalledWith(album, [songWithoutId]);
  });

  test("getAll calls repository's getAll method", async () => {
    await mockService.getAll();

    expect(repositoryMock.getAll).toHaveBeenCalledTimes(1);
  });

  test("getAlbumsLength calls repository's getAlbumsLength method", async () => {
    await mockService.getAlbumsLength();

    expect(repositoryMock.getAlbumsLength).toHaveBeenCalledTimes(1);
  });

  test("getLastAlbum calls repository's getLastAlbum method", async () => {
    await mockService.getLastAlbum();

    expect(repositoryMock.getLastAlbum).toHaveBeenCalledTimes(1);
  });

  test("getById calls repository's getById method", async () => {
    await mockService.getById(1);

    expect(repositoryMock.getById).toHaveBeenCalledTimes(1);
    expect(repositoryMock.getById).toHaveBeenCalledWith(1);
  });

  test('getById throws an error on undefined albumId as argument', async () => {
    await expect(mockService.getById()).rejects.toThrowError(AlbumIdNotDefinedError);
  });

  test("getAlbumIfExistByTitle calls repository's getAlbumIfExistByTitle method", async () => {
    await mockService.getAlbumIfExistByTitle('Lover');

    expect(repositoryMock.getAlbumIfExistByTitle).toHaveBeenCalledTimes(1);
    expect(repositoryMock.getAlbumIfExistByTitle).toHaveBeenCalledWith('Lover');
  });

  test("delete calls repository's delete method", async () => {
    const album = createTestAlbum(1);
    await mockService.delete(album);

    expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
    expect(repositoryMock.delete).toHaveBeenCalledWith(album);
  });

  test('delete throws an error because of lack of Album entity as argument', async () => {
    await expect(
      mockService.delete({ id: 1, brand: 'Ford', model: 'Fiesta' }),
    ).rejects.toThrowError(AlbumNotDefinedError);
  });
});
