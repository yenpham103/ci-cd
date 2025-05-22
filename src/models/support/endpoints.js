'use strict';
module.exports = (sequelize, DataTypes) => {
    const EndPoints = sequelize.define(
        'endpoints',
        {
            method: DataTypes.STRING(30),
            url: DataTypes.STRING(250),
            status: DataTypes.STRING(50),
            module_id: DataTypes.INTEGER(11),
            user_id: DataTypes.INTEGER(11),
        },
        {
            timestamps: true,
        }
    );
    return EndPoints;
};
