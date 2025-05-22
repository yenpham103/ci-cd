const { PERMISSION } = require('../constants/app.constant');
const { APP_PERMISSION } = require('../constants/shop.constant');
const logger = require('../log');
const AppService = require('../services/app.service');
const { createError } = require('../utils/error');

module.exports = {
    create: async (ctx) => {
        const { body, userData } = ctx.request;
        const { name } = body;

        try {
            if (!name || name.length < 1) {
                throw createError(400, 'Invalid app name');
            }

            await AppService.create({ name });

            ctx.body = {
                status: 'success',
                message: 'Create app success',
            };
            logger.info(__filename, `Create ${name} app success`, userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
    getList: async (ctx) => {
        const { query, userData } = ctx.request;
        const { page, limit, status } = query;
        const _page = page && parseInt(page);
        const _limit = limit && parseInt(limit);
        const realAppID = {
            [APP_PERMISSION['app_login']]: 1,
            [APP_PERMISSION['app_solution']]: 2,
            [APP_PERMISSION['app_portal']]: 3,
            [APP_PERMISSION['app_locator']]: 4,
            [APP_PERMISSION['app_bloop']]: 5,
            [APP_PERMISSION['app_label']]: 6,
            [APP_PERMISSION['app_option']]: 7,
            [APP_PERMISSION['app_mida']]: 8,
            [APP_PERMISSION['app_banner']]: 9,
        };
        try {
            const appIds = [];
            userData?.permissions?.forEach((id) => {
                if (realAppID[id]) {
                    appIds.push(realAppID[id]);
                }
            });
            const apps = await AppService.findAll({
                appIds: appIds,
                limit: _limit,
                offset: _page && _limit && (_page - 1) * _limit,
                status,
            });

            ctx.body = {
                status: 'success',
                data: apps.rows,
                pagination: {
                    page: _page,
                    limit: _limit,
                    totalRecords: apps.count,
                },
            };
            logger.debug(__filename, 'Get list app success', userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
    getByName: async (ctx) => {
        const { params, userData } = ctx.request;
        const app_type = params?.name;
        try {
            if (app_type) {
                const app_id = PERMISSION[app_type];
                const app = await AppService.findOne(app_id);
                ctx.body = {
                    status: 'success',
                    data: app,
                };
                logger.debug(__filename, 'Get list app success', userData.name);
            }
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
};
