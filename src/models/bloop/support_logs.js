'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'bloopSupportLogs',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            shop_id: DataTypes.INTEGER,
            shop_domain: DataTypes.STRING,
            user: DataTypes.STRING,
            content: DataTypes.TEXT,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            tableName: 'fix_bug_for_stores_logs',
        }
    );
};
