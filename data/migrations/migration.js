/* eslint-disable no-unused-vars */

const SongModel = require('../../src/module/song/model/songModel');
const AlbumModel = require('../../src/module/album/model/albumModel');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    AlbumModel.setup(queryInterface.sequelize).sync({ force: true });
    SongModel.setup(queryInterface.sequelize).setupAssociations(AlbumModel).sync({ force: true });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('albums');
    await queryInterface.dropTable('songs');
  },
};
