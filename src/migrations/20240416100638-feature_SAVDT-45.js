'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('support_issues', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER(11),
            },
            reporter: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
            },
            app_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
            },
            module_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
            },
            title: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            solution: {
                type: Sequelize.TEXT,
                allowNull: true,
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

        await queryInterface.createTable(
            'support_issues_reacts',
            {
                id: {
                    type: Sequelize.INTEGER(11),
                    primaryKey: true,
                    allowNull: false,
                    autoIncrement: true,
                },
                user_id: {
                    type: Sequelize.INTEGER(11),
                    allowNull: false,
                    unique: 'actions_unique',
                },
                issue_id: {
                    type: Sequelize.INTEGER(11),
                    allowNull: false,
                    unique: 'actions_unique',
                },
                state: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                    defaultValue: true,
                },
            },
            {
                uniqueKeys: {
                    actions_unique: {
                        fields: ['user_id', 'issue_id'],
                    },
                },
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('support_issues');
        await queryInterface.dropTable('support_issues_reacts');
    },
};
