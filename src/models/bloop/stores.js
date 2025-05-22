'use strict';

module.exports = (sequelize, DataTypes) => {
    const Stores = sequelize.define(
        'stores',
        {
            store_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            status: DataTypes.INTEGER,
            store_type: DataTypes.INTEGER,
        },
        {
            timestamps: false,
        }
    );

    return Stores;
};
