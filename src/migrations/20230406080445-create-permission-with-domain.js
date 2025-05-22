'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('shop_user_accesses', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER(11),
            },
            user_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
            },
            domain: {
                type: Sequelize.STRING(300),
                allowNull: false,
            },
            assigner_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addColumn('permissions', 'shop_user_access', {
            type: Sequelize.TINYINT,
            defaultValue: 0,
            allowNull: false,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('shop_user_accesses');
        await queryInterface.removeColumn('permissions', 'shop_user_access');
    },
};
