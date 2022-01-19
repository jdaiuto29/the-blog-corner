'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Blogs', [{
        title: 'Cupcakes',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Cats',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Cheese',
        createdAt: new Date(),
        updatedAt: new Date()
      }, 
      {
        title: 'Office-speak',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Zombie',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Sports',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Books',
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