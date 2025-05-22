const shopifyGraphQLClient = require('../../utils/shopifyGraphql');
const { PRODUCT_LIST_QUERY, PRODUCT_BY_ID } = require('../query/product.query');

module.exports = {
    getList: async ({ domain, token, first, after, before, last, query }) => {
        return await shopifyGraphQLClient.post({
            domain,
            token,
            query: PRODUCT_LIST_QUERY,
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
            query: PRODUCT_BY_ID,
            variables: {
                id,
            },
        });
    },
};
