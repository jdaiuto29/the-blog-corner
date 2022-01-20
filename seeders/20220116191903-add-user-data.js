'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      firstName: 'yes',
      lastName: 'no',
      email: 'updown@gmail.com',
      password: 'potato',
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
