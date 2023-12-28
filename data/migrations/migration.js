/* eslint-disable no-unused-vars */

const SongModel = require('../../src/module/song/model/songModel');
const AlbumModel = require('../../src/module/album/model/albumModel');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    SongModel.setup(queryInterface.sequelize).sync({ force: true });
    AlbumModel.setup(queryInterface.sequelize).sync({ force: true });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('songs');
    await queryInterface.dropTable('albums');
  },
};
