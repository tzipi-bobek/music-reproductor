const Song = require('../entity/Song');
const SongNotDefinedError = require('../error/SongNotDefinedError');
const SongIdNotDefinedError = require('../error/SongIdNotDefinedError');

module.exports = class SongService {
  /**
   * @param {import('../repository/songRepository')} songRepository
   */
  constructor(songRepository) {
    this.songRepository = songRepository;
  }

  /**
   * @param {import('../entity/Song')} song
   */
  async save(song) {
    if (!(song instanceof Song)) {
      throw new SongNotDefinedError();
    }

    return this.songRepository.save(song);
  }

  async getAll() {
    return this.songRepository.getAll();
  }

  async getSongsLength() {
    return this.songRepository.getSongsLength();
  }

  async getSongsByAlbum(albumId) {
    return this.songRepository.getSongsByAlbum(albumId);
  }

  async getSongsLengthByAlbum(albumId) {
    return this.songRepository.getSongsLengthByAlbum(albumId);
  }

  async getLastSong() {
    return this.songRepository.getLastSong();
  }

  /**
   * @param {number} songId
   * @returns {Promise<Song>}
   */
  async getById(songId) {
    if (!Number(songId)) {
      throw new SongIdNotDefinedError();
    }

    return this.songRepository.getById(songId);
  }

  /**
   * @param {import('../entity/Song')} song
   */
  async delete(song) {
    if (!(song instanceof Song)) {
      throw new SongNotDefinedError();
    }

    return this.songRepository.delete(song);
  }
};
