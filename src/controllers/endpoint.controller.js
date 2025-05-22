const logger = require('../log');
const EndpointService = require('../services/endpoint.service');
const { createError } = require('../utils/error');

module.exports = {
    create: async (ctx) => {
        const { body, userData } = ctx.request;
        const { method, url, status, module_id } = body;

        try {
            if (!url || url.length < 1) {
                throw createError(400, 'Invalid app name');
            }

            const newPoint = await EndpointService.create({ method, url, status, module_id, user_id: userData.id });
            if (!newPoint || !newPoint.id) {
                throw createError(404, 'Endpoint not found');
            }

            ctx.body = {
                status: 'success',
                message: 'Create endpoint success',
            };
            logger.info(__filename, `Create ${newPoint.id} endpoint success`, userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
    getList: async (ctx) => {
        const { query, userData } = ctx.request;
        const { page, limit, url, module_id, models, app_id, method, status } = query;
        const _page = page && parseInt(page);
        const _limit = limit && parseInt(limit);
        try {
            const endpoints = await EndpointService.findAll({
                limit: _limit,
                offset: _page && _limit && (_page - 1) * _limit,
                module_id,
                url,
                models,
                app_id,
                method,
                status,
            });
            ctx.body = {
                status: 'success',
                data: endpoints.rows,
                pagination: {
                    page: _page,
                    limit: _limit,
                    totalRecords: endpoints.count,
                },
            };
            logger.debug(__filename, 'Get list endpoints success', userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
    getPublicList: async (ctx) => {
        const { name } = ctx.request.query;

        try {
            const endpoints = await EndpointService.findAllByApp({
                status: 'public',
                name,
            });

            ctx.body = {
                endpoints,
            };
            logger.debug(__filename, 'Get public endpoints success');
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
    getPrivateList: async (ctx) => {
        const { query, userData } = ctx.request;
        const { name } = query;

        try {
            const endpoints = await EndpointService.findAllByApp({
                status: 'private',
                name,
            });

            ctx.body = {
                endpoints,
            };
            logger.debug(__filename, 'Get list endpoint success', userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
    getProtectList: async (ctx) => {
        const { name } = ctx.request.query;

        try {
            const endpoints = await EndpointService.findAllByApp({
                status: 'none',
                name,
            });

            ctx.body = {
                endpoints,
            };
            logger.debug(__filename, 'Get protect endpoints success');
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
    destroy: async (ctx) => {
        const { params, userData } = ctx.request;
        const { id } = params;

        try {
            const deletedPoint = await EndpointService.delete(id);
            if (!deletedPoint) {
                throw createError(404, 'Endpoint not found');
            }

            ctx.body = {
                status: 'success',
                message: 'Delete endpoint success',
            };
            logger.info(__filename, `Endpoint-${id} delete success`, userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
    getById: async (ctx) => {
        const { params, userData } = ctx.request;
        const { id } = params;

        try {
            const endpoint = await EndpointService.findById(id);
            if (!endpoint) {
                throw createError(404, 'Endpoint not found');
            }

            ctx.body = {
                status: 'success',
                data: endpoint,
            };
            logger.debug(__filename, 'Get endpoint info success', userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
    update: async (ctx) => {
        const { body, params, userData } = ctx.request;
        const { id } = params;
        const { method, url, status, module_id } = body;

        try {
            const endpoint = await EndpointService.update(
                { id },
                {
                    method,
                    url,
                    status,
                    module_id,
                    user_id: userData.id,
                }
            );

            if (!endpoint) {
                throw createError(404, 'Endpoint not found');
            }

            ctx.body = {
                status: 'success',
                message: 'Update endpoint success',
            };
            logger.info(__filename, `Endpoint-${id} update success`, userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
};
