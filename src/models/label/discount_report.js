'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'discountReport',
        {
            id: {
                type: DataTypes.INTEGER(11),
                primaryKey: true,
                autoIncrement: true,
            },
            store_id: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
            },
            store_domain: {
                type: DataTypes.STRING,
            },
            code_id: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
            },
            start_date: {
                type: DataTypes.DATE,
            },
            end_date: {
                type: DataTypes.DATE,
            },
        },
        {
            tableName: 'discount_report',
        }
    );
};
