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
   * @param {import('../../song/entity/Song')} song
   */
  async save(album) {
    return this.albumRepository.save(album);
  }

  /**
   * @param {import('../../song/entity/Song')} song
   */
  async create(song) {
    return this.albumRepository.create(song);
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
  async getAlbumIfExistByTitle(albumTitle) {
    return this.albumRepository.getAlbumIfExistByTitle(albumTitle);
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
