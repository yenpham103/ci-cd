const Session = require('../models')['support'].sequelize.models.sessions;

module.exports = {
    create: async ({ app_id, domain, project_id, user_id, session_id, page_id, first_visit, friendly_name }) => {
        return await Session.create({
            app_id,
            domain,
            project_id,
            user_id,
            session_id,
            page_id,
            first_visit,
            friendly_name,
        });
    },
    findAll: async ({ limit = 10, offset = 0, app_id, domain }) => {
        return await Session.findAndCountAll({
            limit,
            offset,
            where: {
                app_id,
                domain,
            },
            order: [['createdAt', 'DESC']],
        });
    },
};
