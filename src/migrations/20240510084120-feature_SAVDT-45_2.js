'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn('support_issues', 'solution', {
            type: Sequelize.TEXT('long'),
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('support_issues', 'solution', {
            type: Sequelize.TEXT,
        });
    },
};
