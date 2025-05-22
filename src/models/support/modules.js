'use strict';
module.exports = (sequelize, DataTypes) => {
    const Modules = sequelize.define(
        'modules',
        {
            name: DataTypes.STRING(250),
            status: DataTypes.TINYINT,
            app_id: DataTypes.INTEGER(11),
        },
        {
            timestamps: true,
        }
    );
    return Modules;
};
