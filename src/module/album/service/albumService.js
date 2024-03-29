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
  async save(album) {
    return this.albumRepository.save(album);
  }

  /**
   * @param {import('../../song/entity/Song')} song
   */
  async create(song) {
    return this.albumRepository.create(song);
  }

  /**
   * @param {import('../entity/Album')} album
   * @param {import('../../song/entity/Song')[]} songs
   */
  async updateAlbumAttribute(album, songs) {
    return this.albumRepository.updateAlbumAttribute(album, songs);
  }

  async getAlbum(song) {
    return this.albumRepository.getAlbum(song);
  }

  async getPreviousAlbum(song) {
    return this.albumRepository.getPreviousAlbum(song);
  }

  async updatePreviousAlbum(previousAlbum, album, previousSongs) {
    return this.albumRepository.updatePreviousAlbum(previousAlbum, album, previousSongs);
  }

  async updateAlbum(album, songs) {
    return this.albumRepository.updateAlbum(album, songs);
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
    return this.albumRepository.delete(album);
  }
};
