const shopifyGraphQLClient = require('../../utils/shopifyGraphql');
const { CUSTOMER_LIST_QUERY, CUSTOMER_BY_ID } = require('../query/customer.query');

module.exports = {
    getList: async ({ domain, token, first, after, before, last, query }) => {
        return await shopifyGraphQLClient.post({
            domain,
            token,
            query: CUSTOMER_LIST_QUERY,
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
            query: CUSTOMER_BY_ID,
            variables: {
                id,
            },
        });
    },
};
