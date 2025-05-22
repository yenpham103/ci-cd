'use strict';

module.exports = (sequelize, DataTypes) => {
    const partnerApps = sequelize.define(
        'partnerApps',
        {
            id: {
                type: DataTypes.INTEGER(11),
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(300),
            },
            description: {
                type: DataTypes.STRING(1000),
            },
            link_app: {
                type: DataTypes.STRING(300),
            },
            link_img: {
                type: DataTypes.STRING(300),
            },
            sort_order: {
                type: DataTypes.INTEGER(5),
            },
            enable: {
                type: DataTypes.INTEGER(5),
            },
            app_store_url: {
                type: DataTypes.STRING(300),
            },
            public_url: {
                type: DataTypes.STRING(500),
            },
            number_of_reviews: {
                type: DataTypes.INTEGER(5),
            },
            review_point: {
                type: DataTypes.FLOAT,
            },
            show_on_dashboard: {
                type: DataTypes.BOOLEAN,
            },
            picked_for_you: {
                type: DataTypes.BOOLEAN,
            },
            free_plan_available: {
                type: DataTypes.BOOLEAN,
            },
            is_free: {
                type: DataTypes.BOOLEAN,
            },
        },
        {
            tableName: 'partner_apps',
        }
    );

    return partnerApps;
};
