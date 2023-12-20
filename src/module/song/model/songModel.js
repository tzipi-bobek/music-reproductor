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
        artist: {
          type: DataTypes.TEXT,
          defaultValue: 'unknown',
          allowNull: false,
        },
        albumArtist: {
          type: DataTypes.TEXT,
          defaultValue: 'unknown',
        },
        compositor: {
          type: DataTypes.TEXT,
          defaultValue: 'unknown',
        },
        genre: {
          type: DataTypes.TEXT,
          defaultValue: 'unknown',
        },
        lyrics: {
          type: DataTypes.TEXT,
        },
        lyricist: {
          type: DataTypes.TEXT,
          defaultValue: 'unknown',
        },
        trackNumber: {
          type: DataTypes.INTEGER,
          defaultValue: 1,
        },
        year: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        comment: {
          type: DataTypes.TEXT,
          defaultValue: 'unknown',
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

  /**
   * @param {typeof import('../../album/model/albumModel')} AlbumModel
   */
  static setupAssociations(AlbumModel) {
    SongModel.belongsTo(AlbumModel, { foreignKey: 'albumID', constraints: true });
    AlbumModel.hasMany(SongModel, { foreignKey: 'albumID', constraints: false });
    return SongModel;
  }
}

module.exports = SongModel;
