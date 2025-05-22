const SupportIssueReact = require('../models')['support'].sequelize.models.support_issues_reacts;

module.exports = {
    upsert: async ({ user_id, issue_id, state }) => {
        await SupportIssueReact.upsert(
            { user_id, issue_id, state },
            {
                conflictPaths: [`user_id`, `issue_id`],
                skipUpdateIfNoValuesChanged: true,
                upsertType: 'on-duplicate-key-update',
            }
        );
    },

    findOne: async ({ user_id, issue_id }) => {
        return SupportIssueReact.findOne({
            where: { issue_id, user_id },
        });
    },
};
