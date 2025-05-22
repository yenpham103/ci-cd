'use strict';
module.exports = (sequelize, DataTypes) => {
    const Theme = sequelize.define(
        'shop_user_accesses',
        {
            user_id: DataTypes.INTEGER(11),
            domain: DataTypes.STRING(300),
            assigner_id: DataTypes.INTEGER(11),
        },
        {
            timestamps: true,
        }
    );
    return Theme;
};
