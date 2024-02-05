const SongService = require('../songService');
const createTestSong = require('../../controller/__test__/songs.fixture');
const SongNotDefinedError = require('../../error/SongNotDefinedError');
const SongIdNotDefinedError = require('../../error/SongIdNotDefinedError');

const repositoryMock = {
  save: jest.fn(),
  getAll: jest.fn(),
  getSongsLength: jest.fn(),
  getSongsByAlbum: jest.fn(),
  getSongsLengthByAlbum: jest.fn(),
  getLastSong: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn(),
};

const mockService = new SongService(repositoryMock);

describe('SongService methods', () => {
  test("save calls repository's save method", async () => {
    const song = createTestSong(1);
    await mockService.save(song);

    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    expect(repositoryMock.save).toHaveBeenCalledWith(song);
  });

  test('save throws an error because of lack of Song entity as argument', async () => {
    await expect(
      mockService.save({ id: 1, title: 'Daylight', albumTitle: 'Lover' }),
    ).rejects.toThrowError(SongNotDefinedError);
  });

  test("getAll calls repository's getAll method", async () => {
    await mockService.getAll();

    expect(repositoryMock.getAll).toHaveBeenCalledTimes(1);
  });

  test("getSongsLength calls repository's getSongsLength method", async () => {
    await mockService.getSongsLength();

    expect(repositoryMock.getSongsLength).toHaveBeenCalledTimes(1);
  });

  test("getSongsByAlbum calls repository's getSongsByAlbum method", async () => {
    await mockService.getSongsByAlbum(1);

    expect(repositoryMock.getSongsByAlbum).toHaveBeenCalledTimes(1);
    expect(repositoryMock.getSongsByAlbum).toHaveBeenCalledWith(1);
  });

  test("getSongsLengthByAlbum calls repository's getSongsLengthByAlbum method", async () => {
    await mockService.getSongsLengthByAlbum(1);

    expect(repositoryMock.getSongsLengthByAlbum).toHaveBeenCalledTimes(1);
    expect(repositoryMock.getSongsLengthByAlbum).toHaveBeenCalledWith(1);
  });

  test("getLastSong calls repository's getLastSong method", async () => {
    await mockService.getLastSong();

    expect(repositoryMock.getLastSong).toHaveBeenCalledTimes(1);
  });

  test("getById calls repository's getById method", async () => {
    await mockService.getById(1);

    expect(repositoryMock.getById).toHaveBeenCalledTimes(1);
    expect(repositoryMock.getById).toHaveBeenCalledWith(1);
  });

  test('getById throws an error on undefined songId as argument', async () => {
    await expect(mockService.getById()).rejects.toThrowError(SongIdNotDefinedError);
  });

  test("delete calls repository's delete method", async () => {
    const song = createTestSong(1);
    await mockService.delete(song);

    expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
    expect(repositoryMock.delete).toHaveBeenCalledWith(song);
  });

  test('delete throws an error because of lack of Song entity as argument', async () => {
    await expect(
      mockService.delete({ id: 1, title: 'Daylight', albumTitle: 'Lover' }),
    ).rejects.toThrowError(SongNotDefinedError);
  });
});
