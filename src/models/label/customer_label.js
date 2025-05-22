'use strict';

module.exports = (sequelize, DataTypes) => {
    const labels = sequelize.define(
        'customerLabels',
        {
            id: {
                type: DataTypes.INTEGER(11),
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(300),
            },
            path: {
                type: DataTypes.STRING(300),
            },
            domain_id: {
                type: DataTypes.INTEGER(11),
            },
            public_url: {
                type: DataTypes.STRING(300),
            },
        },
        {
            tableName: 'customer_labels',
        }
    );

    return labels;
};
