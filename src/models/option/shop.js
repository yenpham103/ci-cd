'use strict';

module.exports = (sequelize, DataTypes) => {
    const shops = sequelize.define('shops', {
        domain: DataTypes.STRING(250),
        token: DataTypes.STRING(250),
        status: DataTypes.INTEGER(2),
    });

    return shops;
};
