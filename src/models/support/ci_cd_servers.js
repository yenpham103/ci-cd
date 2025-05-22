'use strict';

module.exports = (sequelize, DataTypes) => {
    const CiCdServer = sequelize.define(
        'ci_cd_servers',
        {
            id: {
                type: DataTypes.INTEGER(11),
                primaryKey: true,
                autoIncrement: true,
            },
            site_name: {
                type: DataTypes.STRING(1000),
                unique: true,
            },
            remote_server: {
                type: DataTypes.STRING(1000),
            },
            build_application: {
                type: DataTypes.INTEGER(11),
            },
            database_migrate: {
                type: DataTypes.INTEGER(11),
            },
            approval_mode: {
                type: DataTypes.INTEGER(11),
            },
            branch_id: {
                type: DataTypes.STRING(1000),
            },
            application_directory: {
                type: DataTypes.STRING(1000),
            },
            skype_chat_chanel: {
                type: DataTypes.STRING(1000),
            },
            status: {
                type: DataTypes.INTEGER(11),
            },
            auto_build: {
                type: DataTypes.INTEGER(11),
            },
            status_eslint: {
                type: DataTypes.INTEGER(2),
            },
            config_repo_id: {
                type: DataTypes.INTEGER(11),
            },
        },
        {
            timestamps: true,
        }
    );

    return CiCdServer;
};
