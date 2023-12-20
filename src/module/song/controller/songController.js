const { fromFormToEntity } = require('../mapper/songMapper');
const SongIdNotDefinedError = require('../error/SongIdNotDefinedError');

module.exports = class SongController {
  /**
   * @param {import('../service/songService')} songService
   */
  constructor(songService, uploadMiddleware) {
    this.songService = songService;
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
    app.post(`${ROUTE}/save`, this.uploadMiddleware.single('cover'), this.save.bind(this));
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
      title: 'Add New Song',
    });
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async save(req, res) {
    const song = fromFormToEntity(req.body);
    if (req.file) {
      const path = req.file.path.split('public')[1];
      song.img = path;
    }
    await this.songService.save(song);
    res.redirect(this.ROUTE_BASE);
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async delete(req, res) {
    const { songId } = req.params;
    const song = await this.songService.getById(songId);
    this.songService.delete(song);
    res.redirect(this.ROUTE_BASE);
  }
};
