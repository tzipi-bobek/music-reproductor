const { fromModelToEntity } = require('../mapper/albumMapper');
const Album = require('../entity/Album');
const AlbumNotDefinedError = require('../error/AlbumNotDefinedError');
const AlbumIdNotDefinedError = require('../error/AlbumIdNotDefinedError');
const AlbumNotFoundError = require('../error/AlbumNotFoundError');
const SongModel = require('../../song/model/songModel');

module.exports = class AlbumRepository {
  /**
   * @param {typeof import('../model/albumModel')} albumModel
   */
  constructor(albumModel) {
    this.albumModel = albumModel;
  }

  /**
   * @param {import('../../song/entity/Song')} song
   */
  async create(song) {
    const albumInstance = this.albumModel.build({
      title: song.albumTitle,
      artist: song.albumArtist,
      songsNumber: 1,
      cover: song.cover,
      year: song.year,
    });
    await albumInstance.save();
    return fromModelToEntity(albumInstance, song);
  }

  /**
   * @param {import('../../album/entity/Album')} album
   */
  // eslint-disable-next-line class-methods-use-this
  async save(album) {
    const albumInstance = album;
    albumInstance.songsNumber += 1;
    await albumInstance.save();
    return fromModelToEntity(albumInstance);
  }

  /**
   * @param {number} albumId
   * @returns {Promise<import('../entity/Album')>}
   */
  async getAlbumIfExistByTitle(albumTitle) {
    const albumInstance = await this.albumModel.findByPk(albumTitle);
    if (albumInstance) {
      return albumInstance.id;
    }
    return false;
  }

  async getAll() {
    const albumInstances = await this.albumModel.findAll();
    return albumInstances.map((albumInstance) => fromModelToEntity(albumInstance));
  }

  async getAlbumsLength() {
    return this.albumModel.count();
  }

  async getSongsLength() {
    return this.albumModel.songs.count();
  }

  async getLastAlbum() {
    const albumInstance = await this.albumModel.findOne({
      order: [['id', 'DESC']],
    });
    return fromModelToEntity(albumInstance);
  }

  /**
   * @param {number} albumId
   * @returns {Promise<import('../entity/Album')>}
   */
  async getById(albumId) {
    if (!Number(albumId)) {
      throw new AlbumIdNotDefinedError();
    }

    const albumInstance = await this.albumModel.findByPk(albumId, {
      include: SongModel,
      paranoid: false,
    });
    if (!albumInstance) {
      throw new AlbumNotFoundError(`No existe el album con ID ${albumId}`);
    }

    return fromModelToEntity(albumInstance);
  }

  /**
   * @param {import('../entity/Album')} album
   * @returns {Promise<Boolean>} Returns true if a album was deleted, otherwise it returns false
   */
  async delete(album) {
    if (!(album instanceof Album)) {
      throw new AlbumNotDefinedError();
    }

    return Boolean(await this.albumModel.destroy({ where: { id: album.id } }));
  }
};
