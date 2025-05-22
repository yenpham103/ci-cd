'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'bloopSupport',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            shop_id: DataTypes.INTEGER,
            shop_domain: DataTypes.STRING,
            content: DataTypes.TEXT,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            tableName: 'fix_bug_for_stores',
        }
    );
};
