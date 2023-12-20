const SongController = require('./controller/songController');
const SongService = require('./service/songService');
const SongRepository = require('./repository/songRepository');
const SongModel = require('./model/songModel');

/**
 * @param {import('express').Application} app
 * @param {import('rsdi').IDIContainer} container
 */
function initSongModule(app, container) {
  /**
   * @type {SongController} controller
   */
  const controller = container.get('SongController');
  controller.configureRoutes(app);
}

module.exports = { SongController, SongService, SongRepository, SongModel, initSongModule };
