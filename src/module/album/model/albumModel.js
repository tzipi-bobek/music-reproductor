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
        },
        artist: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        songsNumber: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        cover: {
          type: DataTypes.INTEGER,
        },
        year: {
          type: DataTypes.INTEGER,
          allowNull: false,
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
