'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Posts', [{
      UserId: 1,
      BlogId: 2,
      text: 'This is a post!',
      createdAt: new Date(),
      updatedAt: new Date()

    }]);

    down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('Posts', {
        id: {
          [Sequelize.Op.or]: [
            1,

          ]
        }
      })
    }
  }
};
