'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await Spot.bulkCreate([
      {
        owner_id: 1,
        address: '1 Nest Way',
        city: 'Nest City',
        state: 'Nest',
        country: 'USA',
        lat: 40.7645358,
        lng: -120.4730327,
        name: 'Nest1 Home',
        description: 'The first nest',
        price: 199.99,
        preview_image: '',
      },
      {
        owner_id: 2,
        address: '2 Nest Way',
        city: 'Nest City',
        state: 'Nest',
        country: 'USA',
        lat: 45.7645358,
        lng: -125.4730327,
        name: 'Nest2 Home',
        description: 'The first nest',
        price: 249.99,
        preview_image: '',
      },
      {
        owner_id: 3,
        address: '3 Nest Way',
        city: 'Nest City',
        state: 'Nest',
        country: 'USA',
        lat: 50.7645358,
        lng: -130.4730327,
        name: 'Nest3 Home',
        description: 'The first nest',
        price: 299.99,
        preview_image: '',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: { [Op.in]: ['Nest1 Home', 'Nest2 Home', 'Nest3 Home'] },
      },
      {}
    );
  },
};
