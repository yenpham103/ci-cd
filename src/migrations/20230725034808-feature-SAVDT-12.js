'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('sessions', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER(11),
            },
            app_id: {
                type: Sequelize.INTEGER(11),
                references: {
                    model: {
                        tableName: 'apps',
                    },
                    key: 'id',
                },
                allowNull: false,
            },
            domain: {
                type: Sequelize.STRING(300),
                allowNull: false,
            },
            project_id: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            user_id: {
                type: Sequelize.STRING(100),
            },
            session_id: {
                type: Sequelize.STRING(250),
                allowNull: false,
            },
            page_id: {
                type: Sequelize.STRING(250),
            },
            first_visit: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            friendly_name: {
                type: Sequelize.STRING(250),
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
        await queryInterface.dropTable('sessions');
    },
};
