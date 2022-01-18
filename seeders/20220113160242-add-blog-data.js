'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Blogs', [{
        title: 'Games',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Movies',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Music',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },


  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Blogs', {
      id: {
        [Sequelize.Op.or]: [
          4,

        ]
      }
    })
  }
};