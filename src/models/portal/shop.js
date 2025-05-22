'use strict';

module.exports = (sequelize, DataTypes) => {
    const shops = sequelize.define(
        'shops',
        {
            domain: DataTypes.STRING(200),
            token: DataTypes.STRING(100),
            status: DataTypes.TINYINT,
            plan_name: DataTypes.STRING(100),
        },
        {
            tableName: 'shops',
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
        }
    );

    return shops;
};
