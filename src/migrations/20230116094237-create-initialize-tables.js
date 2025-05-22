'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Users
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER(11),
            },
            email: {
                unique: true,
                allowNull: false,
                type: Sequelize.STRING(250),
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING(100),
            },
            name: {
                allowNull: false,
                unique: true,
                type: Sequelize.STRING(100),
            },
            role: {
                type: Sequelize.STRING(50),
            },
            token: {
                type: Sequelize.TEXT,
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            deletedAt: {
                type: Sequelize.DATE,
            },
        });
        // Permissions
        await queryInterface.createTable('permissions', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER(11),
            },
            user_id: {
                type: Sequelize.INTEGER(11),
                unique: true,
                allowNull: false,
            },
            app_login: {
                type: Sequelize.TINYINT,
                defaultValue: 0,
                allowNull: false,
            },
            app_solution: {
                type: Sequelize.TINYINT,
                defaultValue: 0,
                allowNull: false,
            },
            app_mida: {
                type: Sequelize.TINYINT,
                defaultValue: 0,
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
        // Themes
        await queryInterface.createTable(
            'themes',
            {
                id: {
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                    type: Sequelize.INTEGER(11),
                },
                domain: {
                    type: Sequelize.STRING(300),
                    allowNull: false,
                    unique: 'actions_unique',
                },
                theme_id: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                    unique: 'actions_unique',
                },
                createdAt: {
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
            {
                uniqueKeys: {
                    actions_unique: {
                        fields: ['domain', 'theme_id'],
                    },
                },
            }
        );
        // Versions
        await queryInterface.createTable('versions', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER(11),
            },
            theme_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
            },
            asset_key: {
                type: Sequelize.STRING(150),
                allowNull: false,
            },
            content_type: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            value: {
                type: Sequelize.JSON,
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
    },

    // eslint-disable-next-line
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
        await queryInterface.dropTable('permissions');
        await queryInterface.dropTable('themes');
        await queryInterface.dropTable('versions');
    },
};
