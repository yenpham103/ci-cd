'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'labelsSupportLogs',
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
            tableName: 'fix-bug-for-stores-logs',
        }
    );
};
