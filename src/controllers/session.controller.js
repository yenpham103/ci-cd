const logger = require('../log');
const SessionService = require('../services/session.service');
const { clientError } = require('../utils/error');

module.exports = {
    create: async (ctx) => {
        const { body } = ctx.request;
        const { app_id, domain, project_id, user_id, session_id, page_id, first_visit, friendly_name } = body;

        try {
            if (!session_id || !domain) {
                return clientError(ctx, 400, 'Invalid domain or sessionId');
            }

            await SessionService.create({
                app_id,
                domain,
                project_id,
                user_id,
                session_id,
                page_id,
                first_visit,
                friendly_name,
            });

            ctx.body = {
                status: 'success',
            };
            logger.info(__filename, `Create session success`, `AppID-${app_id}`, domain);
        } catch (error) {
            logger.error(__filename, error.message, `AppID-${app_id}`, domain);
            ctx.throw(error.status, error.message);
        }
    },
    getList: async (ctx) => {
        const { query, userData } = ctx.request;
        const { page, limit, app_id, domain } = query;
        const _page = page && parseInt(page);
        const _limit = limit && parseInt(limit);

        try {
            const sessions = await SessionService.findAll({
                limit: _limit,
                offset: _page && _limit && (_page - 1) * _limit,
                app_id,
                domain,
            });

            ctx.body = {
                status: 'success',
                data: sessions.rows,
                pagination: {
                    page: _page,
                    limit: _limit,
                    totalRecords: sessions.count,
                },
            };
            logger.debug(__filename, 'Get list session success', userData.name, domain);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
};
