const logger = require('../log');
const ModuleService = require('../services/module.service');
const { createError } = require('../utils/error');

module.exports = {
    create: async (ctx) => {
        const { body, userData } = ctx.request;
        const { name, app_id } = body;

        try {
            if (!name || name.length < 1) {
                throw createError(400, 'Invalid module name');
            }

            await ModuleService.create({ name, app_id });

            ctx.body = {
                status: 'success',
                message: 'Create module success',
            };
            logger.info(__filename, `Create ${name} module success`, userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
    getList: async (ctx) => {
        const { query, userData } = ctx.request;
        const { page, limit, app_id } = query;
        const _page = page && parseInt(page);
        const _limit = limit && parseInt(limit);

        try {
            const modules = await ModuleService.findAll({
                limit: _limit,
                offset: _page && _limit && (_page - 1) * _limit,
                app_id,
            });

            ctx.body = {
                status: 'success',
                data: modules.rows,
                pagination: {
                    page: _page,
                    limit: _limit,
                    totalRecords: modules.count,
                },
            };
            logger.debug(__filename, 'Get list module success', userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
};
