require('dotenv').config();
const { getApiParams } = require('../utils/shopifyApi');

const { SHOPIFY_API_VERSION } = process.env;

module.exports = {
    getConfig: async ({ domain, token, fields }) => {
        const params = getApiParams('GET', token);
        const url = `https://${domain}/admin/api/${SHOPIFY_API_VERSION}/shop.json?fields=${fields}`;
        const res = await fetch(url, params);
        return await res.json();
    },
};
