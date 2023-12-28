const Album = require('../entity/Album');
const AlbumNotDefinedError = require('../error/AlbumNotDefinedError');
const AlbumIdNotDefinedError = require('../error/AlbumIdNotDefinedError');

module.exports = class AlbumService {
  /**
   * @param {import('../repository/albumRepository')} albumRepository
   */
  constructor(albumRepository) {
    this.albumRepository = albumRepository;
  }

  /**
   * @param {import('../entity/Album')} album
   */
  async save(song) {
    return this.albumRepository.save(song);
  }

  async getAll() {
    return this.albumRepository.getAll();
  }

  async getAlbumsLength() {
    return this.albumRepository.getAlbumsLength();
  }

  async getLastAlbum() {
    return this.albumRepository.getLastAlbum();
  }

  /**
   * @param {number} albumId
   * @returns {Promise<Album>}
   */
  async getById(albumId) {
    if (!Number(albumId)) {
      throw new AlbumIdNotDefinedError();
    }

    return this.albumRepository.getById(albumId);
  }

  /**
   * @param {number} albumId
   * @returns {Promise<Album>}
   */
  async getAlbumIfExist(albumId) {
    return this.albumRepository.getAlbumIfExist(albumId);
  }

  /**
   * @param {import('../entity/Album')} album
   */
  async delete(album) {
    if (!(album instanceof Album)) {
      throw new AlbumNotDefinedError();
    }
    if (album.songs.length === 0) {
      return this.albumRepository.delete(album);
    }
    return this;
  }
};
