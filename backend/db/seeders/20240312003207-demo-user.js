'use strict';

/** @type {import('sequelize-cli').Migration} */

const { User } = require('../models');
const bcrypt = require('bcryptjs');

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
    await User.bulkCreate(
      [
        {
          email: 'demo@user.io',
          firstName: 'demo1',
          lastName: 'demo1',
          username: 'Demo-lition',
          password: bcrypt.hashSync('password'),
        },
        {
          email: 'user1@user.io',
          firstName: 'user1',
          lastName: 'user1',
          username: 'FakeUser1',
          password: bcrypt.hashSync('password2'),
        },
        {
          email: 'user2@user.io',
          firstName: 'user2',
          lastName: 'user2',
          username: 'FakeUser2',
          password: bcrypt.hashSync('password3'),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] },
      },
      {}
    );
  },
};
