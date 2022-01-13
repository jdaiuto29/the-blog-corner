'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Blogs', [
      {
        id: 1, 
        title: 'Sports',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2, 
        title: 'Flowers',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3, 
        title: 'Books',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
   },
   

   down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Blogs', {
        id: {
            [Sequelize.Op.or]: [
                11,
                12
            ]
        }
    })
}
};
