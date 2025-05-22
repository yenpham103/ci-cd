const logger = require('../log');
const ShopUserAccessService = require('../services/shop_user_access.service');
const { createError } = require('../utils/error');

module.exports = {
    insertOneDomain: async (ctx) => {
        const { body, userData } = ctx.request;
        const { user_id, domain } = body;

        try {
            if (!domain || !domain.includes('.myshopify.com')) {
                throw createError(400, 'Domain invalid or incorrect');
            }

            await ShopUserAccessService.insertOne({ user_id, domain, assigner_id: userData.id });
            ctx.body = {
                status: 'success',
                message: 'Insert domain success',
            };
            logger.info(__filename, `Insert domain for ${user_id} success`, userData.name, domain);
        } catch (error) {
            logger.error(__filename, error.message, userData.name, domain);
            ctx.throw(error.status, error.message);
        }
    },
    getListByUser: async (ctx) => {
        const { query, userData } = ctx.request;
        const { user_id } = query;

        try {
            const shops = await ShopUserAccessService.findAll({ user_id });

            ctx.body = {
                status: 'success',
                data: shops,
            };
            logger.debug(__filename, `Get list domain with user-${user_id} success`, userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
    deleteById: async (ctx) => {
        const { params, userData } = ctx.request;
        const { id } = params;

        try {
            const isDeleted = await ShopUserAccessService.deleteOne(id);

            if (!isDeleted) {
                throw createError(404, 'Shop access not found');
            }

            ctx.body = {
                status: 'success',
                message: 'Delete shop success',
            };
            logger.info(__filename, `ShopUserAccess-${id}: remove success`, userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
};
