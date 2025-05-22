'use strict';
module.exports = (sequelize, DataTypes) => {
    const Theme = sequelize.define(
        'themes',
        {
            domain: DataTypes.STRING(300),
            theme_id: DataTypes.STRING(100),
        },
        {
            timestamps: true,
        }
    );
    return Theme;
};
