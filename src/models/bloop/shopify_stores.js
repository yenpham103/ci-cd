'use strict';

module.exports = (sequelize, DataTypes) => {
    const ShopifyStores = sequelize.define(
        'shopify_stores',
        {
            shopify_domain: DataTypes.STRING,
            shopify_access_token: DataTypes.STRING,
        },
        {
            timestamps: false,
        }
    );

    return ShopifyStores;
};
