'use strict';

module.exports = (sequelize, DataTypes) => {
    const auth = sequelize.define(`auth`, {
        shop: DataTypes.STRING(255),
        accessToken: DataTypes.STRING(255),
        plan_code: DataTypes.STRING(255),
        quantity: DataTypes.INTEGER(11),
        extend_store_limit: DataTypes.INTEGER(5),
        status: DataTypes.INTEGER(11),
    });

    return auth;
};
