const AlbumController = require('./controller/albumController');
const AlbumService = require('./service/albumService');
const AlbumRepository = require('./repository/albumRepository');
const AlbumModel = require('./model/albumModel');

/**
 * @param {import('express').Application} app
 * @param {import('rsdi').IDIContainer} container
 */
function initAlbumModule(app, container) {
  /**
   * @type {AlbumController} controller
   */
  const controller = container.get('AlbumController');
  controller.configureRoutes(app);
}

module.exports = { AlbumController, AlbumService, AlbumRepository, AlbumModel, initAlbumModule };
