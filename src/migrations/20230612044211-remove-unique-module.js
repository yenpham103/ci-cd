'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeConstraint('modules', 'name');
    },

    async down(queryInterface, Sequelize) {},
};
