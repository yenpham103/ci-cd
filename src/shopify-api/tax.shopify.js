require('dotenv').config();
const { getApiParams } = require('../utils/shopifyApi');

const { SHOPIFY_API_VERSION } = process.env;

module.exports = {
    getAllCountries: async ({ domain, token, fields }) => {
        const params = getApiParams('GET', token);
        const url = `https://${domain}/admin/api/${SHOPIFY_API_VERSION}/countries.json?fields=${fields}`;
        const res = await fetch(url, params);
        return await res.json();
    },
    getCountryById: async ({ domain, token, id }) => {
        const params = getApiParams('GET', token);
        const url = `https://${domain}/admin/api/${SHOPIFY_API_VERSION}/countries/${id}.json`;
        const res = await fetch(url, params);
        return await res.json();
    },
};
