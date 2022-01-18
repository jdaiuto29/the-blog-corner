'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      firstName: 'LaLa',
      lastName: 'blahblah',
      email: 'yes@gmail.com',
      password: 'cookies',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('Users', {
        id: {
          [Sequelize.Op.or]: [
            4,

          ]
        }
      })
    }
  }
};
