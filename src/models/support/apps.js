'use strict';
module.exports = (sequelize, DataTypes) => {
    const Apps = sequelize.define(
        'apps',
        {
            name: DataTypes.STRING(250),
            status: DataTypes.TINYINT,
        },
        {
            timestamps: true,
        }
    );
    return Apps;
};
