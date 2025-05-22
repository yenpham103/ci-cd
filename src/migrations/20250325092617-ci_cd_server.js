'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.createTable('ci_cd_servers', {
            id: {
                type: Sequelize.INTEGER(11),
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            site_name: {
                type: Sequelize.STRING(1000),
                unique: true,
                allowNull: false,
            },
            remote_server: {
                type: Sequelize.STRING(1000),
                allowNull: true,
            },
            build_application: {
                type: Sequelize.INTEGER(11),
                allowNull: true,
            },
            database_migrate: {
                type: Sequelize.INTEGER(11),
                allowNull: true,
            },
            approval_mode: {
                type: Sequelize.INTEGER(11),
                allowNull: true,
            },
            branch_id: {
                type: Sequelize.STRING(1000),
                allowNull: true,
            },
            application_directory: {
                type: Sequelize.STRING(1000),
                allowNull: true,
            },
            skype_chat_chanel: {
                type: Sequelize.STRING(1000),
                allowNull: true,
            },
            status: {
                type: Sequelize.INTEGER(11),
                allowNull: true,
            },
            auto_build: {
                type: Sequelize.INTEGER(11),
                allowNull: true,
            },
            status_eslint: {
                type: Sequelize.INTEGER(2),
                allowNull: true,
            },
            config_repo_id: {
                type: Sequelize.INTEGER(11),
                allowNull: true,
                references: {
                    model: 'ci_cd_repos',
                    key: 'id',
                },
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable('ci_cd_servers');
    },
};
