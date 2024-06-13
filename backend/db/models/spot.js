'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, { foreignKey: 'owner_id' });
      Spot.hasMany(models.SpotImage, { foreignKey: 'spot_Id' });
      Spot.hasMany(models.Review, { foreignKey: 'spot_Id' });
      Spot.hasMany(models.Booking, { foreignKey: 'spot_Id' });
    }
  }

  Spot.init(
    {
      owner_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: true,
          notEmpty: {
            msg: 'Street address is required',
          },
        },
      },

      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: {
            msg: 'City is required',
          },
        },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'State is required',
          },
          notEmpty: {
            msg: 'State is required',
          },
        },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: {
            msg: 'Country is required',
          },
        },
      },
      lat: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        // validate: {
        //   notNull: {
        //     msg: 'Latitude is required',
        //   },
        //   notEmpty: {
        //     msg: 'Latitude is required',
        //   },
        //   min: {
        //     args: [-90],
        //     msg: 'Latitude must be greater than or equal to -90',
        //   },
        //   max: {
        //     args: [90],
        //     msg: 'Latitude must be less than or equal to 90',
        //   },
        // },
      },
      lng: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        // validate: {
        //   notNull: {
        //     msg: 'Longitude is required',
        //   },
        //   notEmpty: {
        //     msg: 'Longitude is required',
        //   },
        //   min: {
        //     args: [-180],
        //     msg: 'Longitude must be greater than or equal to -180',
        //   },
        //   max: {
        //     args: [180],
        //     msg: 'Longitude must be less than or equal to 180',
        //   },
        // },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Name is required',
          },
          notEmpty: {
            msg: 'Name is required',
          },
          len: {
            args: [2, 50],
            msg: 'Name is required and must be less than 50 characters',
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Description is required',
          },
          notEmpty: {
            msg: 'Description is required',
          },
        },
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Price per day is required',
          },
          min: {
            args: [1],
            msg: 'Price per day is required',
          },
        },
      },
      preview_image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Preview image is required',
          },
          notEmpty: {
            msg: 'Preview image is required',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Spot',
    }
  );
  return Spot;
};
