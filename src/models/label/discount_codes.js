'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'discountCodes',
        {
            id: {
                type: DataTypes.INTEGER(11),
                primaryKey: true,
            },
            discount_name: DataTypes.STRING(200),
            name: DataTypes.STRING,
            status: DataTypes.TINYINT,
            start_date: DataTypes.DATE,
            end_date: DataTypes.DATE,
            type: DataTypes.TINYINT,
            value: DataTypes.DECIMAL(20, 2),
            limit_in_intervals: DataTypes.INTEGER(5),
            plans_from: DataTypes.STRING(50),
            plans_to: DataTypes.STRING(50),
            plan_intervals: DataTypes.STRING(200),
            yearly_price_discount: DataTypes.TINYINT,
            total_discount: DataTypes.INTEGER,
            unlimited_discount: DataTypes.BOOLEAN,
        },
        {
            tableName: 'discount_codes',
        }
    );
};
