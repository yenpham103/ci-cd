'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'bannerSupport',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            shop_domain: DataTypes.STRING,
            content: DataTypes.TEXT,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            tableName: 'support_codes',
            timestamps: false,
        }
    );
};
