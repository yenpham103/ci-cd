'use strict';

module.exports = (sequelize, DataTypes) => {
    const CiCdRepos = sequelize.define(
        'ci_cd_repos',
        {
            id: {
                type: DataTypes.INTEGER(11),
                primaryKey: true,
                autoIncrement: true,
            },
            repo_name: {
                type: DataTypes.STRING(100),
            },
            group_name: {
                type: DataTypes.STRING(100),
            },
        },
        {
            timestamps: true,
        }
    );
    return CiCdRepos;
};
