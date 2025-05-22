const logger = require('../log');
const { customerGraphql } = require('../graphql');
const { createError } = require('../utils/error');

module.exports = {
    getList: async (ctx) => {
        const { userData, body, shop } = ctx.request;
        const { domain, first, after, before, last, name } = body;

        try {
            const { token } = shop;
            const res = await customerGraphql.getList({
                domain,
                token,
                first: first && parseInt(first),
                last: last && parseInt(last),
                after,
                before,
                query: name?.trim() && name,
            });

            if (res.errors) {
                throw createError(400, JSON.stringify(res.errors));
            }

            ctx.body = {
                status: 'success',
                data: res.data.customers,
                pageInfo: res.data.pageInfo,
            };

            logger.info(__filename, 'Get customer list success', userData.name, domain);
        } catch (error) {
            logger.error(__filename, error.message, userData.name, domain);
            ctx.throw(error.status, error.message);
        }
    },

    getById: async (ctx) => {
        const { userData, body, shop } = ctx.request;
        const { domain, id } = body;

        try {
            const { token } = shop;
            const res = await customerGraphql.getById({ domain, token, id: 'gid://shopify/Customer/' + id });
            if (res.errors) {
                throw createError(400, JSON.stringify(res.errors));
            }

            ctx.body = {
                status: 'success',
                data: res.data.customer,
            };
            logger.info(__filename, `customer[${id}]: get success`, userData.name, domain);
        } catch (error) {
            logger.error(__filename, error.message, userData.name, domain);
            ctx.throw(error.status, error.message);
        }
    },
};
