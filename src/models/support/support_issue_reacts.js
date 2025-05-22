'use strict';
module.exports = (sequelize, DataTypes) => {
    const SupportIssuesReact = sequelize.define(
        'support_issues_reacts',
        {
            user_id: DataTypes.INTEGER(11),
            issue_id: DataTypes.INTEGER(11),
            state: DataTypes.BOOLEAN,
        },
        {
            timestamps: false,
        }
    );
    return SupportIssuesReact;
};
