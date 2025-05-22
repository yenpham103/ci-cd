'use strict';

module.exports = (sequelize, DataTypes) => {
    const shops = sequelize.define('shops', {
        domain: DataTypes.STRING(300),
        token: DataTypes.STRING(300),
        enable: DataTypes.INTEGER(5),
        up_to_date: DataTypes.BOOLEAN,
        remain_trial_days: DataTypes.INTEGER,
        charge_id: DataTypes.STRING(300),
    });

    return shops;
};
