/* eslint-disable strict */
// eslint-disable-next-line lines-around-directive
'use strict';

const SongModel = require('../../src/module/song/model/songModel');
const AlbumModel = require('../../src/module/album/model/albumModel');

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: async (queryInterface, Sequelize) => {
    AlbumModel.setup(queryInterface.sequelize).sync({ force: true });
    SongModel.setup(queryInterface.sequelize).setupAssociations(AlbumModel).sync({ force: true });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('albums');
    await queryInterface.dropTable('songs');
  },
};
