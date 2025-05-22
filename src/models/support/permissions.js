'use strict';
module.exports = (sequelize, DataTypes) => {
    const Permissions = sequelize.define(
        'permissions',
        {
            user_id: DataTypes.INTEGER(11),
            app_login: DataTypes.TINYINT,
            app_solution: DataTypes.TINYINT,
            app_mida: DataTypes.TINYINT,
            shop_user_access: DataTypes.TINYINT,
            access_endpoint: DataTypes.TINYINT,
            app_label: DataTypes.TINYINT,
            app_portal: DataTypes.TINYINT,
            app_option: DataTypes.TINYINT,
            app_locator: DataTypes.TINYINT,
            app_bloop: DataTypes.TINYINT,
            app_subscription: DataTypes.TINYINT,
            app_banner: DataTypes.TINYINT,
            config_ci_cd: DataTypes.TINYINT,
        },
        {
            timestamps: true,
        }
    );
    return Permissions;
};
