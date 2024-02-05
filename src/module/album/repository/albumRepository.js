/* eslint-disable no-param-reassign */
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
      include: SongModel,
    });
    await albumInstance.save();
    return fromModelToEntity(albumInstance);
  }

  /**
   * @param {import('../entity/Album')} album
   */
  async save(album) {
    await this.albumModel.update(
      {
        songsNumber: album.songsNumber,
        cover: album.cover,
        artist: album.artist,
        year: album.year,
      },
      { where: { id: album.id } },
    );
    const updatedAlbum = await this.albumModel.findByPk(album.id);
    return fromModelToEntity(updatedAlbum);
  }

  async updateAlbumAttribute(album, songs) {
    if (!album || !songs) {
      throw new Error('Invalid album or songs');
    }

    const albumAttributes = ['cover', 'year', 'artist'];
    const songAttributes = ['cover', 'year', 'albumArtist'];

    for (let i = 0; i < 3; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      album = await this.updateAttribute(album, songs, albumAttributes[i], songAttributes[i]);
    }

    return album;
  }

  /**
   * @param {import('../entity/Album')} album
   * @param {import('../../song/entity/Song')[]} songs
   */
  // eslint-disable-next-line class-methods-use-this
  async updateAttribute(album, songs, albumAttribute, songAttribute) {
    const albumAttributeExistsInSongs =
      songs.some((thisSong) => thisSong[songAttribute] === album[albumAttribute]) &&
      album[albumAttribute];

    const songsWithAttribute = songs.filter((thisSong) => thisSong[songAttribute]);

    if (!albumAttributeExistsInSongs && songsWithAttribute.length > 0) {
      const newAttribute = songsWithAttribute[0][songAttribute];
      album[albumAttribute] = newAttribute;
    }

    return album;
  }

  /**
   * @param {import('../entity/Album')} album
   * @param {import('../../song/entity/Song')} song
   */
  async getAlbum(song) {
    const { albumTitle } = song;
    let album = await this.getAlbumIfExistByTitle(albumTitle);
    if (!album) {
      album = await this.create(song);
    }
    return album;
  }

  /**
   * @param {import('../entity/Album')} previousAlbum
   * @param {import('../../song/entity/Song')} song
   */
  async getPreviousAlbum(song) {
    let previousAlbum;
    if (song.id) {
      previousAlbum = await this.getById(song.albumId);
    }
    return previousAlbum;
  }

  /**
   * @param {import('../entity/Album')} album
   * @param {import('../entity/Album')} previousAlbum
   * @param {import('../../song/entity/Song')[]} previousSongs
   */
  async updatePreviousAlbum(previousAlbum, album, previousSongs) {
    if (previousAlbum && previousAlbum.id !== album.id) {
      if (previousAlbum.songsNumber === 0) {
        await this.delete(previousAlbum);
      } else {
        previousAlbum = await this.updateAlbumAttribute(previousAlbum, previousSongs);
        await this.save(previousAlbum);
      }
    }
  }

  /**
   * @param {import('../entity/Album')} album
   * @param {import('../../song/entity/Song')[]} songs
   */
  async updateAlbum(album, songs) {
    album = await this.updateAlbumAttribute(album, songs);
    await this.save(album);
  }

  async getAll() {
    const albumInstances = await this.albumModel.findAll();
    return albumInstances.map((albumInstance) => fromModelToEntity(albumInstance));
  }

  async getAlbumsLength() {
    return this.albumModel.count();
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
   * @param {string} albumTitle
   * @returns {Promise<import('../entity/Album')>}
   */
  async getAlbumIfExistByTitle(albumTitle) {
    const albumInstance = await this.albumModel.findOne({
      where: { title: albumTitle },
    });
    if (albumInstance !== null) {
      return albumInstance;
    }
    return false;
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
