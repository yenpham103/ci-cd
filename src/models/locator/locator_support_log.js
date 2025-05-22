'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'locatorSupportLog',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
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
