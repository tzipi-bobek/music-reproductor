const { Sequelize } = require('sequelize');
const SongRepository = require('../songRepository');
const songModel = require('../../model/songModel');
const albumModel = require('../../../album/model/albumModel');
const createTestSong = require('../../controller/__test__/songs.fixture');
const createTestAlbum = require('../../../album/controller/__test__/album.fixture');
const SongNotDefinedError = require('../../error/SongNotDefinedError');
const SongIdNotDefinedError = require('../../error/SongIdNotDefinedError');
const SongNotFoundError = require('../../error/SongNotFoundError');

describe('SongRepository methods', () => {
  let sequelize;
  let SongModel;
  let songRepository;
  beforeEach(async () => {
    sequelize = new Sequelize('sqlite::memory');
    albumModel.setup(sequelize);
    SongModel = songModel.setup(sequelize);
    SongModel.setupAssociations(albumModel);
    songRepository = new SongRepository(SongModel);

    await sequelize.sync({ force: true });
  });

  test('saves a new song in DB', async () => {
    const songWithoutId = createTestSong();
    const { id, title, albumTitle, artist } = await songRepository.save(songWithoutId);
    expect(id).toEqual(1);
    expect(title).toEqual('Daylight');
    expect(albumTitle).toEqual('Lover');
    expect(artist).toEqual('Taylor Swift');
  });

  test('updates a song in DB', async () => {
    const songWithoutId = createTestSong();
    const songWithId = createTestSong(1);
    songWithId.title = 'The Man';
    songWithId.artist = 'no taylor';

    const newSong = await songRepository.save(songWithoutId);
    const newSongTwo = await songRepository.save(songWithoutId);
    expect(newSong.id).toEqual(1);
    expect(newSongTwo.id).toEqual(2);

    const updatedSong = await songRepository.save(songWithId);
    expect(updatedSong.id).toEqual(1);
    expect(updatedSong.title).toEqual('The Man');
    expect(updatedSong.artist).toEqual('no taylor');
  });

  test('save throws an error because of lack of Song entity as argument', async () => {
    const song = {
      id: 1,
      title: 'Afterglow',
      albumTitle: 'Lover',
    };
    await expect(songRepository.save(song)).rejects.toThrowError(SongNotDefinedError);
  });

  test('getAll returns every song stored in DB', async () => {
    const songWithoutId = createTestSong(undefined);
    await songRepository.save(songWithoutId);
    await songRepository.save(songWithoutId);
    const songs = await songRepository.getAll();

    expect(songs).toHaveLength(2);
    expect(songs[0].id).toEqual(1);
    expect(songs[1].id).toEqual(2);
  });

  test('getSongsLength returns number of songs stored in DB', async () => {
    const songWithoutId = createTestSong(undefined);
    await songRepository.save(songWithoutId);
    await songRepository.save(songWithoutId);
    await songRepository.save(songWithoutId);
    const songsLength = await songRepository.getSongsLength();

    expect(songsLength).toEqual(3);
  });

  test('getSongsByAlbum returns all songs from a specific album', async () => {
    const songWithoutId = createTestSong(undefined);
    await songRepository.save(songWithoutId);
    await songRepository.save(songWithoutId);

    const songs = await songRepository.getSongsByAlbum(songWithoutId.albumId);
    expect(songs).toHaveLength(2);
    expect(songs[0].albumId).toEqual(songWithoutId.albumId);
    expect(songs[1].albumId).toEqual(songWithoutId.albumId);
  });

  test('getSongsLengthByAlbum returns the number of songs in a specific album', async () => {
    const songWithoutId = createTestSong(undefined);
    await songRepository.save(songWithoutId);
    await songRepository.save(songWithoutId);

    const songCount = await songRepository.getSongsLengthByAlbum(songWithoutId.albumId);
    expect(songCount).toEqual(2);
  });

  test('getLastSong returns last song stored in DB', async () => {
    const songWithoutId = createTestSong(undefined);
    await songRepository.save(songWithoutId);
    await songRepository.save(songWithoutId);
    const songThree = await songRepository.save(songWithoutId);
    const lastSong = await songRepository.getLastSong();

    expect(lastSong).toEqual(songThree);
  });

  test('getById returns single song from DB', async () => {
    const songWithoutId = createTestSong();
    const albumWithoutId = createTestAlbum(1);
    songWithoutId.albumId = albumWithoutId.id;
    await songRepository.save(songWithoutId);

    const songInstance = await songRepository.songModel.findByPk(1);
    await songInstance.createAlbum(albumWithoutId);

    const song = await songRepository.getById(1);
    expect(song.id).toEqual(1);
    expect(song.albumId).toEqual(1);
  });

  test('getById throws an error on undefined songId as argument', async () => {
    await expect(songRepository.getById()).rejects.toThrowError(SongIdNotDefinedError);
  });

  test('getById throws an error because there is no song stored in DB with this ID', async () => {
    const songId = 2;

    await expect(songRepository.getById(songId)).rejects.toThrowError(SongNotFoundError);
    await expect(songRepository.getById(songId)).rejects.toThrowError(
      `No existe la cancion con ID ${songId} (quizás haya sido eliminado)`,
    );
  });

  test('deletes an existing song in DB and returns true', async () => {
    const songWithoutId = createTestSong();
    await songRepository.save(songWithoutId);
    await songRepository.save(songWithoutId);
    await songRepository.save(songWithoutId);

    const song = await songRepository.getById(2);
    const deletedSong = await songRepository.delete(song);
    const remainingSongs = await songRepository.getAll();

    expect(deletedSong).toEqual(true);
    expect(remainingSongs[0].id).toEqual(1);
    expect(remainingSongs[1].id).toEqual(3);
  });

  test('tries to delete non-existent song in DB and returns false', async () => {
    const songWithoutId = createTestSong();
    await songRepository.save(songWithoutId);
    await songRepository.save(songWithoutId);

    const songNumberThree = createTestSong(3);
    const deletedSong = await songRepository.delete(songNumberThree);

    expect(deletedSong).toEqual(false);
  });

  test('delete throws an error because of lack of Song entity as argument', async () => {
    const song = {
      id: 1,
      title: 'The Archer',
      albumTitle: 'Lover',
    };
    await expect(songRepository.delete(song)).rejects.toThrowError(SongNotDefinedError);
  });
});
