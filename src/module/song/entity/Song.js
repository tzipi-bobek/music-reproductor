module.exports = class Song {
  /**
   * @param {number} id
   * @param {string} title
   * @param {string} artist
   * @param {string} albumArtist
   * @param {string} compositor
   * @param {string} genre
   * @param {string} lyrics
   * @param {string} lyricist
   * @param {number} trackNumber
   * @param {number} year
   * @param {string} comment
   * @param {string} audioFile
   * @param {string} cover
   * @param {number} albumID
   * @param {string} createdAt
   * @param {string} updatedAt
   * @param {string} deletedAt
   * @param {import('../../album/entity/Album')} album
   */
  constructor(
    id,
    title,
    artist,
    albumArtist,
    compositor,
    genre,
    lyrics,
    lyricist,
    trackNumber,
    year,
    comment,
    audioFile,
    cover,
    albumID,
    createdAt,
    updatedAt,
    deletedAt,
    album,
  ) {
    this.id = id;
    this.title = title;
    this.artist = artist;
    this.albumArtist = albumArtist;
    this.compositor = compositor;
    this.genre = genre;
    this.lyrics = lyrics;
    this.lyricist = lyricist;
    this.trackNumber = trackNumber;
    this.year = year;
    this.comment = comment;
    this.audioFile = audioFile;
    this.cover = cover;
    this.albumID = albumID;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.album = album;
  }

  get name() {
    return `${this.title}`;
  }
};
