'use strict';

module.exports = (sequelize, DataTypes) => {
    const discountCodes = sequelize.define(
        'discountCodes',
        {
            id: {
                type: DataTypes.INTEGER(11),
                primaryKey: true,
                autoIncrement: true,
            },
            discount_name: {
                type: DataTypes.STRING(200),
            },
            discount_code: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            status: {
                type: DataTypes.TINYINT,
                allowNull: false,
            },
            start_date: {
                type: DataTypes.DATE,
            },
            end_date: {
                type: DataTypes.DATE,
            },
            type: {
                type: DataTypes.TINYINT,
                allowNull: false,
            },
            value: {
                type: DataTypes.DECIMAL(20, 2),
                allowNull: false,
            },
            limit_in_intervals: {
                type: DataTypes.INTEGER(5),
                allowNull: false,
            },
            plans_from: {
                type: DataTypes.STRING(50),
            },
            plans_to: {
                type: DataTypes.STRING(50),
            },
            total_discount: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            unlimited_discount: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            tableName: 'discount_codes',
        }
    );

    return discountCodes;
};
