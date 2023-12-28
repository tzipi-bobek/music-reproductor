const fs = require('fs');
const path = require('path');

const { default: DIContainer, object, get, factory } = require('rsdi');
const { Sequelize } = require('sequelize');
const multer = require('multer');

const { DefaultController } = require('../module/default/module');
const { SongController, SongService, SongRepository, SongModel } = require('../module/song/module');
const {
  AlbumController,
  AlbumService,
  AlbumRepository,
  AlbumModel,
} = require('../module/album/module');

function configureSequelizeDatabase() {
  return new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_PATH,
  });
}

/**
 * @param {DIContainer} container
 */
function configureSongModule(container) {
  return SongModel.setup(container.get('Sequelize'));
}

/**
 * @param {DIContainer} container
 */
function configureAlbumModule(container) {
  return AlbumModel.setup(container.get('Sequelize'));
}

function configureMulter() {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      const dir = `${process.env.MULTER_UPLOADS_DIR}/`;
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename(req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
  });
  return multer({ storage });
}

/**
 * @param {DIContainer} container
 */
function addCommonDefinitions(container) {
  container.addDefinitions({
    Sequelize: factory(configureSequelizeDatabase),
    Multer: factory(configureMulter),
    DefaultController: object(DefaultController).construct(get('AlbumService')),
  });
}

/**
 * @param {DIContainer} container
 */
function addSongModuleDefinitions(container) {
  container.addDefinitions({
    SongController: object(SongController).construct(
      get('SongService'),
      get('AlbumService'),
      get('Multer'),
    ),
    SongService: object(SongService).construct(get('SongRepository')),
    SongRepository: object(SongRepository).construct(get('SongModel')),
    SongModel: factory(configureSongModule),
  });
}

/**
 * @param {DIContainer} container
 */
function addAlbumModuleDefinitions(container) {
  container.addDefinitions({
    AlbumController: object(AlbumController).construct(get('AlbumService'), get('Multer')),
    AlbumService: object(AlbumService).construct(get('AlbumRepository')),
    AlbumRepository: object(AlbumRepository).construct(get('AlbumModel')),
    AlbumModel: factory(configureAlbumModule),
  });
}

/**
 * @returns {DIContainer}
 */
module.exports = function configureDI() {
  const container = new DIContainer();
  addCommonDefinitions(container);
  addSongModuleDefinitions(container);
  addAlbumModuleDefinitions(container);
  return container;
};
