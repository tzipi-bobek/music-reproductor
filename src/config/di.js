const fs = require('fs');
const path = require('path');

const { default: DIContainer, object, get, factory } = require('rsdi');
const { Sequelize } = require('sequelize');
const multer = require('multer');

const { DefaultController } = require('../module/default/module');
const {
  SongController,
  SongService,
  SongRepository,
  SongModel,
} = require('../module/song/module');
const {
  AlbumController,
  AlbumService,
  AlbumRepository,
  AlbumModel,
} = require('../module/album/module');
