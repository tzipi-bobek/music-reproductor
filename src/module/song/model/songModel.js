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
          defaultValue: 'unknown',
        },
        artist: {
          type: DataTypes.TEXT,
          defaultValue: 'unknown',
          allowNull: false,
        },
        albumArtist: {
          type: DataTypes.TEXT,
          allowNull: false,
          defaultValue: 'unknown',
        },
        compositor: {
          type: DataTypes.TEXT,
          allowNull: false,
          defaultValue: 'unknown',
        },
        genre: {
          type: DataTypes.TEXT,
          allowNull: false,
          defaultValue: 'unknown',
        },
        lyrics: {
          type: DataTypes.TEXT,
        },
        lyricist: {
          type: DataTypes.TEXT,
          allowNull: false,
          defaultValue: 'unknown',
        },
        trackNumber: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        year: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
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

  /**
   * @param {typeof import('../../album/model/albumModel')} AlbumModel
   */
  static setupAssociations(AlbumModel) {
    AlbumModel.hasMany(SongModel, { foreignKey: 'albumId', constraints: false });
    SongModel.belongsTo(AlbumModel, { foreignKey: 'albumId', constraints: false });

    return SongModel;
  }
}

module.exports = SongModel;
