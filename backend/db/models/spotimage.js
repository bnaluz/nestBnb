'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SpotImage.belongsTo(models.Spot, { foreignKey: 'id' });
    }
  }
  SpotImage.init(
    {
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      preview: {
        type: DataTypes.BOOLEAN,
      },
      spot_Id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Spot',
        },
      },
    },
    {
      sequelize,
      modelName: 'SpotImage',
    }
  );
  return SpotImage;
};
