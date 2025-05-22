'use strict';
module.exports = (sequelize, DataTypes) => {
    const reviewed_customer = sequelize.define(
        'reviewed_customer',
        {
            id: {
                type: DataTypes.INTEGER(11),
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(300),
            },
            domain: {
                type: DataTypes.STRING(300),
                unique: true,
            },
            is_review: {
                type: DataTypes.BOOLEAN,
            },
            createdAt: {
                type: DataTypes.DATE,
            },
        },
        {
            timestamps: false,
            tableName: 'reviewed_customer',
        }
    );

    return reviewed_customer;
};
