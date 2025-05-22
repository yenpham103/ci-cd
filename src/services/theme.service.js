const { getApiParams } = require('../utils/shopifyApi');

require('dotenv').config();

const { SHOPIFY_API_VERSION } = process.env;

module.exports = {
    findAll: async ({ domain, token, query }) => {
        const params = getApiParams('GET', token);
        const url = `https://${domain}/admin/api/${SHOPIFY_API_VERSION}/themes.json?${new URLSearchParams(query)}`;
        const res = await fetch(url, params);
        return await res.json();
    },
    findAllAsset: async ({ domain, token, themeId, fields }) => {
        const params = getApiParams('GET', token);
        let url = `https://${domain}/admin/api/${SHOPIFY_API_VERSION}/themes/${themeId}/assets.json`;
        if (fields) {
            url += `?fields=${fields}`;
        }
        const res = await fetch(url, params);
        return await res.json();
    },
    findSingleAsset: async ({ domain, token, themeId, key, fields }) => {
        const params = getApiParams('GET', token);
        let url = `https://${domain}/admin/api/${SHOPIFY_API_VERSION}/themes/${themeId}/assets.json?asset[key]=${key}`;
        if (fields) {
            url += `&fields=${fields}`;
        }
        const res = await fetch(url, params);
        return await res.json();
    },
    saveAsset: async ({ domain, token, themeId, key, value, source_key }) => {
        const params = getApiParams('PUT', token, { asset: { key, value, source_key } });
        const url = `https://${domain}/admin/api/${SHOPIFY_API_VERSION}/themes/${themeId}/assets.json`;
        const res = await fetch(url, params);
        return await res.json();
    },
    removeAsset: async ({ domain, token, themeId, key }) => {
        const params = getApiParams('DELETE', token);
        const url = `https://${domain}/admin/api/${SHOPIFY_API_VERSION}/themes/${themeId}/assets.json?asset[key]=${key}`;
        const res = await fetch(url, params);
        return await res.json();
    },
    downloadTheme: async ({ domain, token, themeId }) => {
        const params = getApiParams('POST', token);
        params.responseType = 'arraybuffer';
        const url = `https://${domain}/admin/api/${SHOPIFY_API_VERSION}/themes/${themeId}/download.json`;
        const res = await fetch(url, params);
        return await res.json();
    },
    findSingleAssetRes: async ({ domain, token, themeId, key, fields }) => {
        const params = getApiParams('GET', token);
        let url = `https://${domain}/admin/api/${SHOPIFY_API_VERSION}/themes/${themeId}/assets.json?asset[key]=${key}`;
        if (fields) {
            url += `&fields=${fields}`;
        }
        return await fetch(url, params);
    },
};
