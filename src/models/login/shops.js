'use strict';
module.exports = (sequelize, DataTypes) => {
    const Shop = sequelize.define('shops', {
        domain: DataTypes.STRING(300),
        token: DataTypes.STRING(300),
        installed: DataTypes.SMALLINT,
    });

    return Shop;
};
