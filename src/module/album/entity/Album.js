module.exports = class Album {
  /**
   * @param {number} id
   * @param {string} title
   * @param {string} artist
   * @param {number} songsNumber
   * @param {string} cover
   * @param {number} year
   * @param {string} createdAt
   * @param {string} updatedAt
   * @param {import('../../song/entity/Song')[]} songs
   */
  constructor(id, title, artist, songsNumber, cover, year, createdAt, updatedAt, songs) {
    this.id = id;
    this.title = title;
    this.artist = artist;
    this.songsNumber = songsNumber;
    this.cover = cover;
    this.year = year;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.songs = songs;
  }
};
