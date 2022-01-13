'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Blogs', [
      {
        id: 4, 
        title: 'Books3',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
    },
  

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Blogs', {
      id: {
          [Sequelize.Op.or]: [
              4,
              
          ]
      }
  })
}
};