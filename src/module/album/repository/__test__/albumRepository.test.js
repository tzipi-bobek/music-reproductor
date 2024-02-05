const { Sequelize } = require('sequelize');
const AlbumRepository = require('../albumRepository');
const albumModel = require('../../model/albumModel');
const songModel = require('../../../song/model/songModel');
const createTestAlbum = require('../../controller/__test__/album.fixture');
const createTestSong = require('../../../song/controller/__test__/songs.fixture');
const AlbumNotDefinedError = require('../../error/AlbumNotDefinedError');
const AlbumIdNotDefinedError = require('../../error/AlbumIdNotDefinedError');
const AlbumNotFoundError = require('../../error/AlbumNotFoundError');

describe('AlbumRepository methods', () => {
  let sequelize;
  let AlbumModel;
  let SongModel;
  let albumRepository;
  beforeEach(async () => {
    sequelize = new Sequelize('sqlite::memory');
    AlbumModel = albumModel.setup(sequelize);
    SongModel = songModel.setup(sequelize);
    AlbumModel.hasMany(SongModel, { foreignKey: 'albumId' });
    SongModel.belongsTo(AlbumModel, { foreignKey: 'albumId' });
    albumRepository = new AlbumRepository(AlbumModel);
    await sequelize.sync({ force: true });
  });

  test('create new album and saves in DB', async () => {
    const songWithoutId = createTestSong();
    const albumInstance = await albumRepository.create(songWithoutId);

    expect(albumInstance.id).toEqual(1);
    expect(albumInstance.title).toEqual('Lover');
    expect(albumInstance.artist).toEqual('Taylor Swift');
    expect(albumInstance.cover).toEqual('/img/no-cover-available.jpg');
    expect(albumInstance.year).toEqual(2019);
  });

  test('saves an updated album in DB', async () => {
    const songWithoutId = createTestSong();
    const albumInstance = await albumRepository.create(songWithoutId);
    albumInstance.artist = 'no taylor';
    albumInstance.year = 2013;

    const updatedAlbum = await albumRepository.save(albumInstance);
    expect(updatedAlbum.id).toEqual(1);
    expect(updatedAlbum.artist).toEqual('no taylor');
    expect(updatedAlbum.year).toEqual(2013);
  });

  test('updateAlbumAttribute updates album attributes based on songs', async () => {
    const songWithoutId = createTestSong();
    let albumInstance = await albumRepository.create(songWithoutId);
    songWithoutId.cover = 'new cover';
    songWithoutId.year = 2020;
    songWithoutId.albumArtist = 'new artist';
    const songs = [songWithoutId];
    albumInstance = await albumRepository.updateAlbumAttribute(albumInstance, songs);
    expect(albumInstance.cover).toEqual('new cover');
    expect(albumInstance.year).toEqual(2020);
    expect(albumInstance.artist).toEqual('new artist');
  });

  test('updateAlbumAttribute throws an error when album or songs are not provided', async () => {
    const songWithoutId = createTestSong();
    const albumInstance = await albumRepository.create(songWithoutId);
    const songs = [songWithoutId];

    await expect(albumRepository.updateAlbumAttribute(null, songs)).rejects.toThrowError(
      'Invalid album or songs',
    );

    await expect(albumRepository.updateAlbumAttribute(albumInstance, null)).rejects.toThrowError(
      'Invalid album or songs',
    );
  });

  test('updateAttribute updates a single album attribute based on songs', async () => {
    const songWithoutId = createTestSong();
    let albumInstance = await albumRepository.create(songWithoutId);
    songWithoutId.cover = 'new cover';
    const songs = [songWithoutId];
    albumInstance = await albumRepository.updateAttribute(albumInstance, songs, 'cover', 'cover');
    expect(albumInstance.cover).toEqual('new cover');
  });

  test('updateAttribute does not update album attribute when albumAttributeIsUsed is true', async () => {
    const songWithoutId = createTestSong();
    let albumInstance = await albumRepository.create(songWithoutId);
    const songs = [songWithoutId];
    const originalCover = albumInstance.cover;
    albumInstance = await albumRepository.updateAttribute(albumInstance, songs, 'cover', 'cover');
    expect(albumInstance.cover).toEqual(originalCover);
  });

  test('updateAttribute does not update album attribute when songsWithAttribute.length is 0', async () => {
    const songWithoutId = createTestSong();
    let albumInstance = await albumRepository.create(songWithoutId);
    songWithoutId.cover = null;
    const songs = [songWithoutId];
    const originalCover = albumInstance.cover;
    albumInstance = await albumRepository.updateAttribute(albumInstance, songs, 'cover', 'cover');
    expect(albumInstance.cover).toEqual(originalCover);
  });

  test('getAlbum returns the album for a given song', async () => {
    const songWithoutId = createTestSong();
    const albumInstance = await albumRepository.create(songWithoutId);
    const retrievedAlbum = await albumRepository.getAlbum(songWithoutId);
    expect(retrievedAlbum.id).toEqual(albumInstance.id);
  });

  test('getAlbum creates a new album if it does not exist for a given song', async () => {
    const songWithoutId = createTestSong();
    const album = await albumRepository.getAlbum(songWithoutId);
    expect(album).toBeDefined();
  });

  test('getPreviousAlbum returns the previous album for a given song', async () => {
    const songWithId = createTestSong(1);
    const albumInstance = await albumRepository.create(songWithId);
    songWithId.albumId = albumInstance.id;
    const previousAlbum = await albumRepository.getPreviousAlbum(songWithId);
    expect(previousAlbum.id).toEqual(albumInstance.id);
  });

  test('getPreviousAlbum returns undefined if song.id is undefined', async () => {
    const songWithoutId = createTestSong();
    const previousAlbum = await albumRepository.getPreviousAlbum(songWithoutId);
    expect(previousAlbum).toBeUndefined();
  });

  test('updatePreviousAlbum updates the previous album if it exists and has songs', async () => {
    const songWithoutId = createTestSong();
    const previousAlbum = await albumRepository.create(songWithoutId);
    const album = await albumRepository.create(songWithoutId);
    songWithoutId.albumId = album.id;
    const previousSongs = [songWithoutId];

    const updateAlbumAttributeMock = jest.spyOn(albumRepository, 'updateAlbumAttribute');
    await albumRepository.updatePreviousAlbum(previousAlbum, album, previousSongs);
    await albumRepository.getById(previousAlbum.id);
    expect(updateAlbumAttributeMock).toHaveBeenCalled();
    expect(updateAlbumAttributeMock).toHaveBeenCalledWith(previousAlbum, previousSongs);
  });

  test('updatePreviousAlbum deletes the previous album if it has no songs', async () => {
    const songWithoutId = createTestSong();
    const previousAlbum = await albumRepository.create(songWithoutId);
    const album = await albumRepository.create(songWithoutId);
    previousAlbum.songsNumber = 0;

    const deleteMock = jest.spyOn(albumRepository, 'delete');
    await albumRepository.updatePreviousAlbum(previousAlbum, album, []);
    expect(deleteMock).toHaveBeenCalled();
    expect(deleteMock).toHaveBeenCalledWith(previousAlbum);
  });

  test('updatePreviousAlbum does not update the album if previousAlbum is not defined or ids are equal', async () => {
    const songWithoutId = createTestSong();
    const albumInstance = await albumRepository.create(songWithoutId);
    const previousSongs = [songWithoutId];

    const deleteMock = jest.spyOn(albumRepository, 'delete');
    const updateAlbumAttributeMock = jest.spyOn(albumRepository, 'updateAlbumAttribute');
    await albumRepository.updatePreviousAlbum(undefined, albumInstance, previousSongs);
    await albumRepository.updatePreviousAlbum(albumInstance, albumInstance, previousSongs);
    expect(updateAlbumAttributeMock && deleteMock).not.toHaveBeenCalled();
  });

  test('updateAlbum updates the album attributes based on songs', async () => {
    const songWithoutId = createTestSong();
    const albumInstance = await albumRepository.create(songWithoutId);
    songWithoutId.albumId = albumInstance.id;
    const songs = [songWithoutId];
    await albumRepository.updateAlbum(albumInstance, songs);
    const updatedAlbum = await albumRepository.getById(albumInstance.id);
    expect(updatedAlbum.songsNumber).toEqual(1);
  });

  test('getAll returns every album stored in DB', async () => {
    const songWithoutId = createTestSong(undefined);
    await albumRepository.create(songWithoutId);
    await albumRepository.create(songWithoutId);
    const albums = await albumRepository.getAll();

    expect(albums).toHaveLength(2);
    expect(albums[0].id).toEqual(1);
    expect(albums[1].id).toEqual(2);
  });

  test('getAlbumsLength returns number of albums stored in DB', async () => {
    const songWithoutId = createTestSong(undefined);
    await albumRepository.create(songWithoutId);
    await albumRepository.create(songWithoutId);
    await albumRepository.create(songWithoutId);
    const albumsLength = await albumRepository.getAlbumsLength();

    expect(albumsLength).toEqual(3);
  });

  test('getLastAlbum returns last album stored in DB', async () => {
    const songWithoutId = createTestSong(undefined);
    await albumRepository.create(songWithoutId);
    await albumRepository.create(songWithoutId);
    const albumThree = await albumRepository.create(songWithoutId);
    const lastAlbum = await albumRepository.getLastAlbum();

    expect(lastAlbum).toEqual(albumThree);
  });

  test('getById returns single album and its songs from DB', async () => {
    const songWithoutId = createTestSong();
    await albumRepository.create(songWithoutId);

    const albumInstance = await albumRepository.albumModel.findByPk(1);
    await albumInstance.createSong(songWithoutId);
    await albumInstance.createSong(songWithoutId);

    const album = await albumRepository.getById(1);
    expect(album.id).toEqual(1);
    expect(album.songs).toHaveLength(2);
  });

  test('getById throws an error on undefined albumId as argument', async () => {
    await expect(albumRepository.getById()).rejects.toThrowError(AlbumIdNotDefinedError);
  });

  test('getById throws an error because there is no album stored in DB with this ID', async () => {
    const albumId = 2;

    await expect(albumRepository.getById(albumId)).rejects.toThrowError(AlbumNotFoundError);
    await expect(albumRepository.getById(albumId)).rejects.toThrowError(
      `No existe el album con ID ${albumId}`,
    );
  });

  test('getAlbumIfExistByTitle returns album if it exists in DB', async () => {
    const songWithoutId = createTestSong();
    const albumInstance = await albumRepository.create(songWithoutId);
    const existingAlbum = await albumRepository.getAlbumIfExistByTitle(albumInstance.title);
    expect(existingAlbum.id).toEqual(albumInstance.id);
  });

  test('getAlbumIfExistByTitle returns false if album does not exist in DB', async () => {
    const nonExistingAlbum = await albumRepository.getAlbumIfExistByTitle('Non-existing title');
    expect(nonExistingAlbum).toBeFalsy();
  });

  test('deletes an existing album in DB and returns true', async () => {
    const songWithoutId = createTestSong();
    await albumRepository.create(songWithoutId);
    await albumRepository.create(songWithoutId);
    await albumRepository.create(songWithoutId);

    const album = await albumRepository.getById(2);
    const deletedAlbum = await albumRepository.delete(album);
    const remainingAlbums = await albumRepository.getAll();

    expect(deletedAlbum).toEqual(true);
    expect(remainingAlbums[0].id).toEqual(1);
    expect(remainingAlbums[1].id).toEqual(3);
  });

  test('tries to delete non-existent album in DB and returns false', async () => {
    const album = createTestAlbum(3);
    const deletedAlbum = await albumRepository.delete(album);

    expect(deletedAlbum).toEqual(false);
  });

  test('delete throws an error because of lack of Album entity as argument', async () => {
    const album = {
      id: 1,
      title: 'Folklore',
      artist: 'Taylor Swift',
    };
    await expect(albumRepository.delete(album)).rejects.toThrowError(AlbumNotDefinedError);
  });
});
