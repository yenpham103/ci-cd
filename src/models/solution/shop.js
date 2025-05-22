'use strict';
module.exports = (sequelize, DataTypes) => {
    const Shop = sequelize.define('shops', {
        domain: DataTypes.STRING(200),
        token: DataTypes.STRING(300),
        status: DataTypes.INTEGER,
        plan_name: DataTypes.STRING(100),
    });

    return Shop;
};
