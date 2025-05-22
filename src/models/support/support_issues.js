'use strict';
module.exports = (sequelize, DataTypes) => {
    const SupportIssues = sequelize.define(
        'support_issues',
        {
            reporter: DataTypes.INTEGER(11),
            app_id: DataTypes.STRING(250),
            module_id: DataTypes.INTEGER(11),
            title: DataTypes.TEXT,
            solution: DataTypes.TEXT,
        },
        {
            timestamps: true,
        }
    );
    return SupportIssues;
};
