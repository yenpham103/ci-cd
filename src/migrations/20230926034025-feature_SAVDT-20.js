'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user_activity_logs', {
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
            name: {
                type: Sequelize.STRING(100),
            },
            email: {
                type: Sequelize.STRING(250),
            },
            creator: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            action: {
                type: Sequelize.STRING(50),
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
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('user_activity_logs');
    },
};
