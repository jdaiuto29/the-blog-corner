'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Blogs', [{
                title: 'Sports',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Flowers',
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