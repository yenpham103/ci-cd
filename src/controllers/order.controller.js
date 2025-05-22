const logger = require('../log');
const { orderGraphql } = require('../graphql');
const { createError } = require('../utils/error');

module.exports = {
    getList: async (ctx) => {
        const { userData, body, shop } = ctx.request;
        const { domain, first, after, before, last, name } = body;

        try {
            const { token } = shop;
            const res = await orderGraphql.getList({
                domain,
                token,
                first: first && parseInt(first),
                last: last && parseInt(last),
                after,
                before,
                query: name?.trim() && 'name:' + name,
            });
            if (res.errors) {
                throw createError(400, JSON.stringify(res.errors));
            }

            ctx.body = {
                status: 'success',
                data: res.data.orders.edges,
                pageInfo: res.data.orders.pageInfo,
            };
            logger.info(__filename, 'Get order list success', userData.name, domain);
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
            const res = await orderGraphql.getById({ domain, token, id: 'gid://shopify/Order/' + id });
            if (res.errors) {
                throw createError(400, JSON.stringify(res.errors));
            }

            ctx.body = {
                status: 'success',
                data: res.data.order,
            };
            logger.info(__filename, `Order[${id}]: get success`, userData.name, domain);
        } catch (error) {
            logger.error(__filename, error.message, userData.name, domain);
            ctx.throw(error.status, error.message);
        }
    },
    getOrderEvents: async (ctx) => {
        const { userData, body, shop } = ctx.request;
        const { domain, orderId, first } = body;

        try {
            const { token } = shop;
            const res = await orderGraphql.getOrderEvents({
                domain,
                token,
                orderId: 'gid://shopify/Order/' + orderId,
                first,
            });
            if (res.errors) {
                throw createError(400, JSON.stringify(res.errors));
            }

            ctx.body = {
                status: 'success',
                data: res.data.order.events.nodes,
                pageInfo: res.data.order.events.pageInfo,
            };
            logger.info(__filename, `OrderEvents[${orderId}]: get success`, userData.name, domain);
        } catch (error) {
            logger.error(__filename, error.message, userData.name, domain);
            ctx.throw(error.status, error.message);
        }
    },
    getLineItems: async (ctx) => {
        const { userData, body, shop } = ctx.request;
        const { domain, orderId, first, after } = body;

        try {
            const { token } = shop;
            const res = await orderGraphql.getOrderLineItems({
                domain,
                token,
                orderId: 'gid://shopify/Order/' + orderId,
                first,
                after,
            });
            if (res.errors) {
                throw createError(400, JSON.stringify(res.errors));
            }

            ctx.body = {
                status: 'success',
                data: res.data.order.lineItems.nodes,
                pageInfo: res.data.order.lineItems.pageInfo,
            };
            logger.info(__filename, `OrderLineItems[${orderId}]: get success`, userData.name, domain);
        } catch (error) {
            logger.error(__filename, error.message, userData.name, domain);
            ctx.throw(error.status, error.message);
        }
    },
};
