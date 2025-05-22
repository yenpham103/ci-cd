'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'users',
        {
            email: DataTypes.STRING(250),
            password: DataTypes.STRING(100),
            name: DataTypes.STRING(100),
            role: DataTypes.STRING(50),
            token: DataTypes.TEXT,
        },
        {
            paranoid: true,
            timestamps: true,
        }
    );
    return User;
};
