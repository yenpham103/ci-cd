'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'optionSupportLogs',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            shop_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            shop_domain: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            user: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: DataTypes.TEXT,
        },
        {
            timestamps: true,
            tableName: 'fix_bug_for_stores_logs',
        }
    );
};
