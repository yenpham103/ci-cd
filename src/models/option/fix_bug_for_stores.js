'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'optionSupport',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            shop_id: {
                type: DataTypes.INTEGER,
                unique: true,
                allowNull: false,
            },
            shop_domain: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            timestamps: true,
            tableName: 'fix_bug_for_stores',
        }
    );
};
