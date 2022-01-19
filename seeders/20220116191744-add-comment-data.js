'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments', [{
      UserId: 1,
      PostId: 1,
      BlogId: 55,
      comment: 'this is a comment',
      createdAt: new Date(),
      updatedAt: new Date()

    }]);

    down: async(queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('Comments', {
        id: {
          [Sequelize.Op.or]: [
            1,

          ]
        }
      })
    }
  }
};