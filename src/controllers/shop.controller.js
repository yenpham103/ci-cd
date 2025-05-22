const logger = require('../log');
const ShopService = require('../services/shop.service');
const ShopUserAccessService = require('../services/shop_user_access.service');
const { createError } = require('../utils/error');
const { hasPermissionWithType } = require('../utils/convertPermission');
const { DEV_ROLE, ADMIN_ROLE, CSE_ROLE } = require('../constants/shop.constant');
const { ShopShopify } = require('../shopify-api');

module.exports = {
    getList: async (ctx) => {
        const { query, userData } = ctx.request;
        const { type, domain, page, limit, fields, status } = query;
        const _page = page && parseInt(page);
        const _limit = limit && parseInt(limit);
        const _status = status ? parseInt(status) : 1;

        try {
            if (userData.role !== ADMIN_ROLE && userData.role !== CSE_ROLE) {
                if (!hasPermissionWithType(userData, type)) {
                    throw createError(403, 'Not permissions');
                }
            }

            let options = {};
            if (fields?.includes('token')) {
                if (userData.role === DEV_ROLE) {
                    const accessShops = await ShopUserAccessService.findAll({ user_id: userData.id });
                    const isAccess = accessShops.some((shop) => shop.domain === domain);
                    if (!isAccess) {
                        throw createError(403, 'Not access domain');
                    }
                }
                options.attributes = ['token'];
                options.where = {
                    domain: domain,
                };
            }

            const shops = await ShopService.findAll(
                {
                    type,
                    domain,
                    limit: _limit,
                    offset: _page && _limit && (_page - 1) * _limit,
                    status: _status,
                },
                options
            );

            if (!shops) {
                throw createError(404, 'Shop not found');
            }

            ctx.body = {
                status: 'success',
                data: shops.rows,
                pagination: {
                    page: _page,
                    limit: _limit,
                    totalRecords: shops.count,
                },
            };
            logger.debug(__filename, `${type}: Get list success`, userData.name, domain);
        } catch (error) {
            logger.error(__filename, error.message, userData.name, domain);
            ctx.throw(error.status, error.message);
        }
    },
    getTaxConfig: async (ctx) => {
        const { userData, body } = ctx.request;
        const { domain, token } = body;
        const fields = 'id,tax_shipping,taxes_included,autoConfigureTaxInclusivity';

        try {
            const taxConfig = await ShopShopify.getConfig({ domain, token, fields });

            ctx.body = {
                status: 'success',
                data: taxConfig.shop,
            };
            logger.info(__filename, `Get tax config success`, userData.name, domain);
        } catch (error) {
            logger.error(__filename, error.message, userData.name, domain);
            ctx.throw(error.status, error.message);
        }
    },
};
