'use strict';
module.exports = (sequelize, DataTypes) => {
    const Version = sequelize.define(
        'versions',
        {
            theme_id: DataTypes.INTEGER(11),
            asset_key: DataTypes.STRING(150),
            content_type: DataTypes.STRING(100),
            value: DataTypes.JSON,
            user_id: DataTypes.INTEGER(11),
        },
        {
            timestamps: true,
        }
    );
    return Version;
};
