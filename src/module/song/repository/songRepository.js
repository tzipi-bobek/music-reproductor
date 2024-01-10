const { fromModelToEntity } = require('../mapper/songMapper');
const { fromModelToEntity: fromAlbumModelToEntity } = require('../../album/mapper/albumMapper');
const Song = require('../entity/Song');
const SongNotDefinedError = require('../error/SongNotDefinedError');
const SongIdNotDefinedError = require('../error/SongIdNotDefinedError');
const SongNotFoundError = require('../error/SongNotFoundError');

module.exports = class SongRepository {
  /**
   * @param {typeof import('../model/songModel')} songModel
   */
  constructor(songModel) {
    this.songModel = songModel;
  }

  /**
   * @param {import('../entity/Song')} song
   * @param {import('../entity/Song').albumId} albumId
   */
  async save(songParam, albumId) {
    if (!(songParam instanceof Song)) {
      throw new SongNotDefinedError();
    }

    const song = { ...songParam };
    song.albumId = albumId;
    const songInstance = this.songModel.build(song, {
      isNewRecord: !song.id,
    });
    await songInstance.save();
    return fromModelToEntity(songInstance, fromAlbumModelToEntity);
  }

  async getAll() {
    const songInstances = await this.songModel.findAll();
    return songInstances.map((songInstance) =>
      fromModelToEntity(songInstance, fromAlbumModelToEntity),
    );
  }

  async getSongsLength() {
    return this.songModel.count();
  }

  async getLastSong() {
    const songInstance = await this.songModel.findOne({
      order: [['id', 'DESC']],
    });
    return fromModelToEntity(songInstance, fromAlbumModelToEntity);
  }

  /**
   * @param {number} songId
   * @returns {Promise<import('../entity/Song')>}
   */
  async getById(songId) {
    if (!Number(songId)) {
      throw new SongIdNotDefinedError();
    }

    const songInstance = await this.songModel.findByPk(songId);
    if (!songInstance) {
      throw new SongNotFoundError(
        `No existe la cancion con ID ${songId} (quizás haya sido eliminado)`,
      );
    }

    return fromModelToEntity(songInstance, fromAlbumModelToEntity);
  }

  /**
   * @param {import('../entity/Song')} song
   * @returns {Promise<Boolean>} Returns true if a song was deleted, otherwise it returns false
   */
  async delete(song) {
    if (!(song instanceof Song)) {
      throw new SongNotDefinedError();
    }

    return Boolean(await this.songModel.destroy({ where: { id: song.id } }));
  }
};
