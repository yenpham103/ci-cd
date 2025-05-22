'use strict';

module.exports = (sequelize, DataTypes) => {
    const shops = sequelize.define('shops', {
        domain: DataTypes.STRING(300),
        token: DataTypes.STRING(300),
        active: DataTypes.INTEGER(5),
    });

    return shops;
};
