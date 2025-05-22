'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'bannerSupportLog',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            shop_domain: DataTypes.STRING,
            user: DataTypes.STRING,
            content: DataTypes.TEXT,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            tableName: 'support_code_logs',
            timestamps: false,
        }
    );
};
