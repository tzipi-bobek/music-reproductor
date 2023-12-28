const { DataTypes, Model } = require('sequelize');

class AlbumModel extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelizeInstance
   */
  static setup(sequelizeInstance) {
    AlbumModel.init(
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
          references: {
            model: 'SongModel',
            key: 'albumTitle',
          },
        },
        artist: {
          type: DataTypes.TEXT,
          allowNull: false,
          references: {
            model: 'SongModel',
            key: 'albumArtist',
          },
        },
        songsNumber: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        cover: {
          type: DataTypes.INTEGER,
          references: {
            model: 'SongModel',
            key: 'cover',
          },
        },
        year: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'SongModel',
            key: 'year',
          },
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: 'Album',
        tableName: 'albums',
        timestamps: true,
      },
    );
    return AlbumModel;
  }
}

module.exports = AlbumModel;
