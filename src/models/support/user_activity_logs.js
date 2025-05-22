'use strict';
module.exports = (sequelize, DataTypes) => {
    const UserActivityLog = sequelize.define(
        'user_activity_logs',
        {
            user_id: DataTypes.INTEGER(11),
            name: DataTypes.STRING(100),
            email: DataTypes.STRING(250),
            creator: DataTypes.STRING(100),
            action: DataTypes.STRING(50),
        },
        {
            timestamps: true,
        }
    );
    return UserActivityLog;
};
