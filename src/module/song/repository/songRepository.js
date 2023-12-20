const { fromModelToEntity } = require('../mapper/songMapper');
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
   */
  async save(song) {
    if (!(song instanceof Song)) {
      throw new SongNotDefinedError();
    }

    const songInstance = this.songModel.build(song, {
      isNewRecord: !song.id,
    });
    await songInstance.save();
    return fromModelToEntity(songInstance);
  }

  async getAll() {
    const songInstances = await this.songModel.findAll();
    return songInstances.map((songInstance) => fromModelToEntity(songInstance));
  }

  async getSongsLength() {
    return this.songModel.count();
  }

  async getLastSong() {
    const songInstance = await this.songModel.findOne({
      order: [['id', 'DESC']],
    });
    return fromModelToEntity(songInstance);
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

    return fromModelToEntity(songInstance);
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
