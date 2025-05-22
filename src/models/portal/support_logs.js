'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        `portalSupportLogs`,
        {
            id: {
                type: DataTypes.INTEGER(11),
                primaryKey: true,
            },
            shop_domain: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            plain_text: {
                type: DataTypes.TEXT,
            },
            bundle_text: {
                type: DataTypes.TEXT,
            },
        },
        {
            tableName: `support_logs`,
            charset: `utf8mb4`,
            collate: `utf8mb4_unicode_ci`,
        }
    );
};
