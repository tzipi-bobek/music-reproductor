module.exports = class Album {
  /**
   * @param {number} id
   * @param {string} title
   * @param {string} artist
   * @param {number} songsNumber
   * @param {string} cover
   * @param {string} createdAt
   * @param {string} updatedAt
   * @param {string} artistFk
   * @param {import('../../song/entity/Song')[]} songs
   */
  constructor(id, title, songsNumber, cover, createdAt, updatedAt, artistFk, songs) {
    this.id = id;
    this.title = title;
    this.songsNumber = songsNumber;
    this.cover = cover;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.artistFk = artistFk;
    this.songs = songs;
  }
};
