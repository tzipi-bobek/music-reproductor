const AlbumIdNotDefinedError = require('../error/AlbumIdNotDefinedError');

module.exports = class AlbumController {
  /**
   * @param {import('../service/albumService')} albumService
   */
  constructor(albumService) {
    this.albumService = albumService;
    this.ROUTE_BASE = '/album';
    this.ALBUM_VIEWS = 'album/views';
  }

  /**
   * @param {import('express').Application} app
   */
  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;
    app.get(`${ROUTE}`, this.index.bind(this));
    app.get(`${ROUTE}/manage`, this.manage.bind(this));
    app.get(`${ROUTE}/view/:albumId`, this.view.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async index(req, res) {
    const albumsLength = await this.albumService.getAlbumsLength();
    let lastAddedAlbum;
    try {
      lastAddedAlbum = await this.albumService.getLastAlbum();
    } catch (e) {
      lastAddedAlbum = null;
    } finally {
      res.render(`${this.ALBUM_VIEWS}/index.njk`, {
        title: 'Last Album Added',
        albumsLength,
        lastAddedAlbum,
      });
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async manage(req, res) {
    const albums = await this.albumService.getAll();
    res.render(`${this.ALBUM_VIEWS}/manage.njk`, {
      title: 'Albums List',
      albums,
    });
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async view(req, res, next) {
    try {
      const { albumId } = req.params;
      if (!Number(albumId)) {
        throw new AlbumIdNotDefinedError();
      }

      const album = await this.albumService.getById(albumId);
      res.render(`${this.ALBUM_VIEWS}/view.njk`, {
        title: `Viewing ${album.title} by ${album.artist} ${album.year}`,
        album,
        songs: album.songs,
      });
    } catch (e) {
      next(e);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async delete(req, res) {
    const { albumId } = req.params;
    const album = await this.albumService.getById(albumId);
    this.albumService.delete(album);
    res.redirect(this.ROUTE_BASE);
  }
};
