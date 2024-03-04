const { fromFormToEntity } = require('../mapper/songMapper');
const SongIdNotDefinedError = require('../error/SongIdNotDefinedError');

module.exports = class SongController {
  /**
   * @param {import('../service/songService')} songService
   * @param {import('../../album/service/albumService')} albumService
   */
  constructor(songService, albumService, uploadMiddleware) {
    this.songService = songService;
    this.albumService = albumService;
    this.uploadMiddleware = uploadMiddleware;
    this.ROUTE_BASE = '/song';
    this.SONG_VIEWS = 'song/views';
  }

  /**
   * @param {import('express').Application} app
   */
  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;
    app.get(`${ROUTE}`, this.index.bind(this));
    app.get(`${ROUTE}/manage`, this.manage.bind(this));
    app.get(`${ROUTE}/view/:songId`, this.view.bind(this));
    app.get(`${ROUTE}/edit/:songId`, this.edit.bind(this));
    app.get(`${ROUTE}/add`, this.add.bind(this));
    app.post(
      `${ROUTE}/save`,
      this.uploadMiddleware.fields([
        { name: 'song-cover', maxCount: 1 },
        { name: 'song-audio', maxCount: 1 },
      ]),
      this.save.bind(this),
    );
    app.post(`${ROUTE}/delete/:songId`, this.delete.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async index(req, res) {
    const songsLength = await this.songService.getSongsLength();
    let lastAddedSong;
    try {
      lastAddedSong = await this.songService.getLastSong();
    } catch (e) {
      lastAddedSong = null;
    } finally {
      res.render(`${this.SONG_VIEWS}/index.njk`, {
        title: 'Listen To a Song',
        songsLength,
        lastAddedSong,
      });
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async manage(req, res) {
    const songs = await this.songService.getAll();
    res.render(`${this.SONG_VIEWS}/manage.njk`, {
      title: 'Songs List',
      songs,
    });
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async view(req, res, next) {
    try {
      const { songId } = req.params;
      if (!Number(songId)) {
        throw new SongIdNotDefinedError();
      }

      const song = await this.songService.getById(songId);
      res.render(`${this.SONG_VIEWS}/view.njk`, {
        title: `Viewing ${song.title}`,
        song,
        album: song.album,
      });
    } catch (e) {
      next(e);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async edit(req, res) {
    const { songId } = req.params;
    if (!Number(songId)) {
      throw new SongIdNotDefinedError();
    }

    const song = await this.songService.getById(songId);
    res.render(`${this.SONG_VIEWS}/edit.njk`, {
      noEsPaginaDeEdicion: false,
      title: `Editing ${song.title} #${song.id}`,
      song,
    });
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  add(req, res) {
    res.render(`${this.SONG_VIEWS}/add.njk`, {
      noEsPaginaDeEdicion: true,
      title: 'Add New Song',
    });
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('../../album/entity/Album')} album
   */
  async save(req, res) {
    const song = fromFormToEntity(req.body);
    const album = await this.albumService.getAlbum(song);
    let previousSong;
    let previousAlbum;
    if (song.id) {
      previousSong = await this.songService.getById(song.id);
      previousAlbum = await this.albumService.getPreviousAlbum(previousSong);
    }

    if (req.files['song-cover']) {
      const coverPath = req.files['song-cover'][0].path.split('public')[1];
      song.cover = coverPath;
    }
    if (req.files['song-audio']) {
      const audioPath = req.files['song-audio'][0].path.split('public')[1];
      song.audioFile = audioPath;
    }

    song.album = await this.albumService.getById(album.id);
    song.albumId = album.id;
    await this.songService.save(song);

    if (previousAlbum) {
      const previousSongs = await this.songService.getSongsByAlbum(previousAlbum.id);
      previousAlbum.songsNumber = await this.songService.getSongsLengthByAlbum(previousAlbum.id);
      await this.albumService.updatePreviousAlbum(previousAlbum, album, previousSongs);
    }

    const songs = await this.songService.getSongsByAlbum(album.id);
    album.songsNumber = await this.songService.getSongsLengthByAlbum(album.id);
    await this.albumService.updateAlbum(album, songs);
    res.redirect(this.ROUTE_BASE);
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async delete(req, res) {
    const { songId } = req.params;
    const song = await this.songService.getById(songId);
    const { albumId } = song;
    let album = await this.albumService.getById(albumId);

    await this.songService.delete(song);

    album.songsNumber = await this.songService.getSongsLengthByAlbum(album.id);

    if (album.songsNumber === 0) {
      await this.albumService.delete(album);
    } else {
      const songs = await this.songService.getSongsByAlbum(albumId);
      album = await this.albumService.updateAlbumAttribute(album, songs);
      await this.albumService.save(album);
    }

    res.redirect(this.ROUTE_BASE);
  }
};
