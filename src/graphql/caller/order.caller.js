const shopifyGraphQLClient = require('../../utils/shopifyGraphql');
const { ORDER_LIST_QUERY, ORDER_BY_ID, ORDER_EVENTS, ORDER_LINE_ITEMS } = require('../query/order.query');

module.exports = {
    getList: async ({ domain, token, first, after, before, last, query }) => {
        return await shopifyGraphQLClient.post({
            domain,
            token,
            query: ORDER_LIST_QUERY,
            variables: {
                first,
                after,
                before,
                last,
                query,
            },
        });
    },
    getById: async ({ domain, token, id }) => {
        return await shopifyGraphQLClient.post({
            domain,
            token,
            query: ORDER_BY_ID,
            variables: {
                id,
            },
        });
    },
    getOrderEvents: async ({ domain, token, orderId, first }) => {
        return await shopifyGraphQLClient.post({
            domain,
            token,
            query: ORDER_EVENTS,
            variables: {
                orderId,
                first,
            },
        });
    },
    getOrderLineItems: async ({ domain, token, orderId, first, after }) => {
        return await shopifyGraphQLClient.post({
            domain,
            token,
            query: ORDER_LINE_ITEMS,
            variables: {
                orderId,
                first,
                after,
            },
        });
    },
};
