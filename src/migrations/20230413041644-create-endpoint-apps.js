'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('apps', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER(11),
            },
            name: {
                type: Sequelize.STRING(250),
                allowNull: false,
                unique: true,
            },
            status: {
                type: Sequelize.TINYINT,
                defaultValue: 1,
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

        await queryInterface.createTable('modules', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER(11),
            },
            name: {
                type: Sequelize.STRING(250),
                allowNull: false,
                unique: true,
            },
            status: {
                type: Sequelize.TINYINT,
                defaultValue: 1,
            },
            app_id: {
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

        await queryInterface.createTable('endpoints', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER(11),
            },
            method: {
                type: Sequelize.STRING(30),
            },
            url: {
                type: Sequelize.STRING(250),
            },
            status: {
                type: Sequelize.STRING(50),
            },
            module_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
            },
            user_id: {
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

        await queryInterface.addColumn('permissions', 'access_endpoint', {
            type: Sequelize.TINYINT,
            defaultValue: 0,
            allowNull: false,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('apps');
        await queryInterface.dropTable('modules');
        await queryInterface.dropTable('endpoints');
        await queryInterface.removeColumn('permissions', 'access_endpoint');
    },
};
