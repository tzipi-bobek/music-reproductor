const { DataTypes, Model } = require('sequelize');

class SongModel extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelizeInstance
   */
  static setup(sequelizeInstance) {
    SongModel.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        title: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        albumTitle: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        artist: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        albumArtist: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        compositor: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        genre: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        lyrics: {
          type: DataTypes.TEXT,
        },
        lyricist: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        trackNumber: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        year: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        comment: {
          type: DataTypes.TEXT,
        },
        audioFile: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        cover: {
          type: DataTypes.INTEGER,
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: 'Song',
        tableName: 'songs',
        timestamps: true,
      },
    );

    return SongModel;
  }
}

module.exports = SongModel;
