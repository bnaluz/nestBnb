'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User, { foreignKey: 'user_Id' });
      Review.belongsTo(models.Spot, { foreignKey: 'spot_Id' });
      Review.hasMany(models.ReviewImage, { foreignKey: 'review_Id' });
    }
  }
  Review.init(
    {
      user_Id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'User',
          key: 'id',
        },
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      spot_Id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Spot',
          key: 'id',
        },
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      review: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
          min: 1,
          max: 5,
        },
      },
    },
    {
      sequelize,
      modelName: 'Review',
    }
  );
  return Review;
};
