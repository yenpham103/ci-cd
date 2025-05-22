'use strict';
/* eslint-disable */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('users', [
            {
                id: 1,
                email: 'admin@gmail.com',
                password: '',
                name: 'Admin',
                role: 'admin',
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', null, {});
    },
};
