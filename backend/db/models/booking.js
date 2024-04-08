'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, { foreignKey: 'id' });
      Booking.belongsTo(models.Spot, { foreignKey: 'id' });
    }
  }
  Booking.init(
    {
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
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'Booking',
    }
  );
  return Booking;
};
