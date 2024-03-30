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
    }
  }
  Review.init(
    {
      user_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      spot_Id: {
        type: DataTypes.INTEGER,
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
      //* unique index for each user to only have 1 review on each spot
      indexes: [
        {
          unique: true,
          fields: ['user_Id', 'spot_Id'],
        },
      ],
    }
  );
  return Review;
};
