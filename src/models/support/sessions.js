'use strict';
module.exports = (sequelize, DataTypes) => {
    const Sessions = sequelize.define(
        'sessions',
        {
            app_id: DataTypes.INTEGER(11),
            domain: DataTypes.STRING(300),
            project_id: DataTypes.STRING(100),
            user_id: DataTypes.STRING(100),
            session_id: DataTypes.STRING(250),
            page_id: DataTypes.STRING(250),
            first_visit: DataTypes.BOOLEAN,
            friendly_name: DataTypes.STRING(250),
        },
        {
            timestamps: true,
        }
    );
    return Sessions;
};
