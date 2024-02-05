const SongController = require('../songController');
const createTestSong = require('./songs.fixture');
const createTestAlbum = require('../../../album/controller/__test__/album.fixture');
const SongIdNotDefinedError = require('../../error/SongIdNotDefinedError');

let songServiceMock;
let albumServiceMock;
let uploadMiddlewareMock;
let reqMock;
let resMock;
let songController;

beforeEach(() => {
  songServiceMock = {
    save: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(() => Array.from({ length: 3 }, (id) => createTestSong(id + 1))),
    getById: jest.fn((id) => createTestSong(id)),
    getSongsLength: jest.fn(() => 3),
    getLastSong: jest.fn(() => createTestSong(3)),
    getSongsLengthByAlbum: jest.fn(() => 3),
    getSongsByAlbum: jest.fn(() => Array.from({ length: 3 }, (id) => createTestSong(id + 1))),
  };

  albumServiceMock = {
    getAll: jest.fn(() => [createTestAlbum(1)]),
    getById: jest.fn(() => createTestAlbum(1)),
    getAlbum: jest.fn(() => createTestAlbum(1)),
    getPreviousAlbum: jest.fn(() => createTestAlbum(1)),
    updatePreviousAlbum: jest.fn(() => undefined),
    updateAlbum: jest.fn(() => undefined),
    updateAlbumAttribute: jest.fn(() => undefined),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  uploadMiddlewareMock = {
    fields: jest.fn(() => (req, res, next) => {
      req.files = {};
      next();
    }),
  };

  reqMock = {
    params: { songId: 1 },
  };

  resMock = {
    render: jest.fn(),
    redirect: jest.fn(),
  };

  songController = new SongController(songServiceMock, albumServiceMock, uploadMiddlewareMock);
});

describe('SongController methods', () => {
  afterEach(() => {
    Object.values(songServiceMock).forEach((mockFn) => mockFn.mockClear());
    Object.values(resMock).forEach((mockFn) => mockFn.mockClear());
  });

  test('configures routes for every method', () => {
    const app = {
      get: jest.fn(),
      post: jest.fn(),
    };
    songController.configureRoutes(app);

    expect(app.get).toHaveBeenCalled();
    expect(app.post).toHaveBeenCalled();
  });

  test('index renders index.njk with overall data and last added song', async () => {
    const songsLength = songServiceMock.getSongsLength();
    const lastAddedSong = songServiceMock.getLastSong();
    await songController.index(reqMock, resMock);

    expect(songServiceMock.getSongsLength).toHaveBeenCalledTimes(2);
    expect(songServiceMock.getLastSong).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('song/views/index.njk', {
      title: 'Listen To a Song',
      songsLength,
      lastAddedSong,
    });
  });

  test('index renders index.njk with songsLength and null lastAddedSong when getLastSong throws an error', async () => {
    songServiceMock.getLastSong.mockImplementationOnce(() => {
      throw new Error();
    });
    await songController.index(reqMock, resMock);
    expect(songServiceMock.getSongsLength).toHaveBeenCalledTimes(1);
    expect(songServiceMock.getLastSong).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('song/views/index.njk', {
      title: 'Listen To a Song',
      songsLength: songServiceMock.getSongsLength(),
      lastAddedSong: null,
    });
  });

  test('manage renders manage.njk with a list of songs', async () => {
    const songs = songServiceMock.getAll();
    await songController.manage(reqMock, resMock);

    expect(songServiceMock.getAll).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);

    expect(resMock.render).toHaveBeenCalledWith('song/views/manage.njk', {
      title: 'Songs List',
      songs,
    });
  });

  test('view renders view.njk with a single song', async () => {
    const song = songServiceMock.getById(1);
    await songController.view(reqMock, resMock);

    expect(songServiceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('song/views/view.njk', {
      title: `Viewing ${song.title}`,
      song,
      album: song.album,
    });
  });

  test('view throws an error on undefined songId as argument', async () => {
    const reqMockWithoutSongId = {
      params: {},
    };

    const nextMock = jest.fn();

    await songController.view(reqMockWithoutSongId, resMock, nextMock);

    expect(nextMock).toHaveBeenCalledTimes(1);
    expect(nextMock).toHaveBeenCalledWith(expect.any(SongIdNotDefinedError));
  });

  test('edit renders a form to edit a song', async () => {
    const song = songServiceMock.getById(1);
    await songController.edit(reqMock, resMock);

    expect(songServiceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('song/views/edit.njk', {
      noEsPaginaDeEdicion: false,
      title: `Editing ${song.title} #${song.id}`,
      song,
    });
  });

  test('edit throws an error on undefined songId as argument', async () => {
    const reqMockWithoutSongId = {
      params: {},
    };

    await expect(() => songController.edit(reqMockWithoutSongId, resMock)).rejects.toThrowError(
      SongIdNotDefinedError,
    );
  });

  test('add renders a form to add a new song', async () => {
    await songController.add(reqMock, resMock);

    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('song/views/add.njk', {
      noEsPaginaDeEdicion: true,
      title: 'Add New Song',
    });
  });

  test('save saves a song and redirects to the song list', async () => {
    const reqSaveMock = {
      body: {
        id: 1,
        title: 'Daylight',
        'album-title': 'Lover',
        artist: 'Taylor Swift',
        'album-artist': 'Taylor Swift',
        compositor: 'Taylor Swift',
        genre: 'Pop',
        lyrics: '',
        lyricist: 'Taylor Swift',
        'track-number': '3',
        year: '2019',
        comment: '',
      },
      files: {
        'song-audio': [{ path: '/public/uploads/song-audio-1704849107017.mp3' }],
        'song-cover': [{ path: '/public/img/no-cover-available.jpg' }],
      },
    };

    const expectedSong = createTestSong(1, await albumServiceMock.getById(1));

    await songController.save(reqSaveMock, resMock);
    expect(songServiceMock.save).toHaveBeenCalledTimes(1);
    expect(songServiceMock.save).toHaveBeenCalledWith(expectedSong);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledWith(songController.ROUTE_BASE);
  });

  test('delete deletes a song and redirects to the song list', async () => {
    const song = createTestSong(1);
    reqMock.params.songId = song.id;
    await songController.delete(reqMock, resMock);
    expect(songServiceMock.delete).toHaveBeenCalledTimes(1);
    expect(songServiceMock.delete).toHaveBeenCalledWith(song);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledWith(songController.ROUTE_BASE);
  });

  test('delete deletes a song and its album when album.songsNumber is 0, then redirects to the song list', async () => {
    const song = createTestSong(1, createTestAlbum(1));
    reqMock.params.songId = song.id;
    songServiceMock.getSongsLengthByAlbum = jest.fn(() => 0);

    await songController.delete(reqMock, resMock);
    expect(songServiceMock.delete).toHaveBeenCalledTimes(1);
    expect(albumServiceMock.delete).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledWith(songController.ROUTE_BASE);
  });
});
