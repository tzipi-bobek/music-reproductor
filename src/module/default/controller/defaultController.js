const albumStatuses = require('../../album/entity/AlbumStatus').statuses;

module.exports = class DefaultController {
  /**
   *
   * @param {import('../../album/service/albumService')} albumService
   */
  constructor(albumService) {
    this.ROUTE_BASE = '/';
    this.VIEWS_DIR = 'default/views';
    this.ALBUM_VIEWS_DIR = 'album/views';
    this.albumService = albumService;
  }

  /**
   * @param {import('express').Application} app
   */
  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;
    app.get(`${ROUTE}`, this.index.bind(this));
    app.get(`${ROUTE}js/album.js`, this.album.bind(this));
  }

  async index(req, res) {
    const albums = await this.albumService.getByStatus(
      albumStatuses.COMPLETE,
      albumStatuses.PENDING,
    );
    res.render(`${this.ALBUM_VIEWS_DIR}/manage.njk`, {
      title: "Últimos Albums - Taylor's Version",
      albums,
    });
  }
};
