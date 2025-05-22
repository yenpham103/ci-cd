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
        await queryInterface.createTable('ci_cd_repos', {
            id: {
                type: Sequelize.INTEGER(11),
                primaryKey: true,
                autoIncrement: true,
            },
            repo_name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            group_name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
            },
            updatedAt: {
                type: Sequelize.DATE,
            },
        });
        await queryInterface.addConstraint('ci_cd_repos', {
            fields: ['repo_name', 'group_name'],
            type: 'unique',
            name: 'unique_repo_name_group_name',
        });
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable('ci_cd_repos');
    },
};
