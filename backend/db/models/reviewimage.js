'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ReviewImage.belongsTo(models.Review, { foreignKey: 'id' });
    }
  }
  ReviewImage.init(
    {
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      review_Id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Review',
        },
      },
    },
    {
      sequelize,
      modelName: 'ReviewImage',
    }
  );
  return ReviewImage;
};
