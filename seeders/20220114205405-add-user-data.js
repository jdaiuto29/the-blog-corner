'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
        firstName: 'Johnny',
        lastName: "Appleseed",
        email: "pancaked@gmail.com",
        password: "pancakes",
        createdAt: new Date(),
        updatedAt: new Date()
      },

    ])
  },

  down: async(queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};