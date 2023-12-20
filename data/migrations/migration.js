const SongModel = require('../../src/module/song/model/songModel');
const AlbumModel = require('../../src/module/album/model/albumModel');

module.exports = {
  up: async (queryInterface) => {
    SongModel.setup(queryInterface.sequelize).setupAssociations(AlbumModel).sync({ force: true });
    AlbumModel.setup(queryInterface.sequelize).setupAssociations(SongModel).sync({ force: true });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('songs');
    await queryInterface.dropTable('albums');
  },
};
