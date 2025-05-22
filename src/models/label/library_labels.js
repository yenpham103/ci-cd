'use strict';

module.exports = (sequelize, DataTypes) => {
    const libs = sequelize.define(
        'libs',
        {
            id: {
                type: DataTypes.INTEGER(11),
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(300),
            },
            plan_id: {
                type: DataTypes.INTEGER(11),
            },
            sort_order: {
                type: DataTypes.INTEGER(5),
            },
            enable: {
                type: DataTypes.INTEGER(5),
            },
            is_background: {
                type: DataTypes.INTEGER(11),
            },
        },
        {
            tableName: 'label_libs',
        }
    );

    return libs;
};
