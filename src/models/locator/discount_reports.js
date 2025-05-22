'use strict';

module.exports = (sequelize, DataTypes) => {
    const discountReport = sequelize.define(
        'discountReport',
        {
            id: {
                type: DataTypes.INTEGER(11),
                primaryKey: true,
                autoIncrement: true,
            },
            shop_id: {
                type: DataTypes.INTEGER(20),
            },
            shop_domain: {
                type: DataTypes.STRING(255),
            },
            discount_code_id: {
                type: DataTypes.INTEGER(11),
            },
            discount_code: {
                type: DataTypes.TEXT,
            },
            discount_type: {
                type: DataTypes.INTEGER(5),
            },
            discount_value: {
                type: DataTypes.DECIMAL(20, 2),
            },
            limit_in_intervals: {
                type: DataTypes.INTEGER(11),
            },
            start_date: {
                type: DataTypes.DATE(),
            },
            end_date: {
                type: DataTypes.DATE(),
            },
        },
        {
            tableName: 'discount_report',
        }
    );

    return discountReport;
};
