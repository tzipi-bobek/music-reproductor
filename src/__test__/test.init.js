require('dotenv').config({
  path: '.env.test',
});
const initDIC = require('../config/di');
const AlbumModel = require('../module/album/model/albumModel');
const SongModel = require('../module/song/model/songModel');

const { initAlbumModule } = require('../module/album/module');
const { initSongModule } = require('../module/song/module');

module.exports = async function bootstrapTests() {
  const app = jest.fn();
  app.get = jest.fn();
  app.post = jest.fn();

  const container = initDIC();

  const sequelize = container.get('Sequelize');
  await AlbumModel.setup(sequelize).sync({ force: true });
  await SongModel.setup(sequelize).setupAssociations(AlbumModel).sync({ force: true });

  initAlbumModule(app, container);
  initSongModule(app, container);
  return container;
};
