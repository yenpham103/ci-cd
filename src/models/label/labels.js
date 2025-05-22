'use strict';

module.exports = (sequelize, DataTypes) => {
    const labels = sequelize.define('labels', {
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
        enable: {
            type: DataTypes.INTEGER(5),
        },
        lib_id: {
            type: DataTypes.INTEGER(11),
        },
        sort_order: {
            type: DataTypes.INTEGER(5),
        },
        public_url: {
            type: DataTypes.STRING(500),
        },
        is_background: {
            type: DataTypes.INTEGER(11),
        },
        ratio: {
            type: DataTypes.FLOAT(10),
        },
        show_trending: {
            type: DataTypes.BOOLEAN,
        },
    });

    return labels;
};
