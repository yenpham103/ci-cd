'use strict';

module.exports = (sequelize, DataTypes) => {
    const ReleaseNote = sequelize.define(
        'ReleaseNote',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            showCTA: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            buttonURL: {
                type: DataTypes.STRING(500),
                defaultValue: '',
            },
            buttonContent: {
                type: DataTypes.STRING(255),
                defaultValue: '',
            },
        },
        {
            tableName: 'release_notes',
            timestamps: false,
        }
    );

    return ReleaseNote;
};
