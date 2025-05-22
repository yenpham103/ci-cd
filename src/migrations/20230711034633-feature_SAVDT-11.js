'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('permissions', 'app_label', {
            type: Sequelize.TINYINT,
            defaultValue: 0,
            allowNull: false,
        });

        await queryInterface.addColumn('permissions', 'app_portal', {
            type: Sequelize.TINYINT,
            defaultValue: 0,
            allowNull: false,
        });

        await queryInterface.addColumn('permissions', 'app_option', {
            type: Sequelize.TINYINT,
            defaultValue: 0,
            allowNull: false,
        });

        await queryInterface.addColumn('permissions', 'app_locator', {
            type: Sequelize.TINYINT,
            defaultValue: 0,
            allowNull: false,
        });

        await queryInterface.addColumn('permissions', 'app_bloop', {
            type: Sequelize.TINYINT,
            defaultValue: 0,
            allowNull: false,
        });

        await queryInterface.addColumn('permissions', 'app_subscription', {
            type: Sequelize.TINYINT,
            defaultValue: 0,
            allowNull: false,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('permissions', 'app_label');
        await queryInterface.removeColumn('permissions', 'app_portal');
        await queryInterface.removeColumn('permissions', 'app_option');
        await queryInterface.removeColumn('permissions', 'app_bloop');
        await queryInterface.removeColumn('permissions', 'app_subscription');
    },
};
