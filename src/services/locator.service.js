const LocatorSupport = require('../models')['locator'].sequelize.models.locatorSupport;
const LocatorSupportLog = require('../models')['locator'].sequelize.models.locatorSupportLog;
const LocatorAuth = require('../models')['locator'].sequelize.models.auth;
const crypto = require('crypto');

module.exports = {
    findByDomain: (domain) => {
        return LocatorSupport.findOne({ where: { shop_domain: domain } });
    },
    findShopByDomain: async ({ domain, select = [] }) => {
        return await LocatorAuth.findOne({
            where: { shop: domain, status: 1 },
            attributes: select.length ? [...select] : undefined,
            raw: true,
        });
    },
    updateOneById: async ({ id, obj, opts = {} }) => {
        return await LocatorAuth.update(obj, { where: { id }, ...opts });
    },
    updateContent: async (domain, content, user) => {
        const endpoint = process.env.LOCATOR_API_URL + '/support';
        const body = JSON.stringify({ domain, content, user });
        const hmac = crypto.createHmac('sha256', process.env.LOCATOR_SECRET_KEY).update(body).digest('hex');
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hmac-sign': hmac,
            },
            body,
        });
        if (!response.ok) {
            let message = response.statusText;
            if (response.status === 400) {
                message = (await response.json()).message;
            }
            throw new Error(message);
        }
    },
    getVersionList: (domain, limit) => {
        return LocatorSupportLog.findAll({
            limit,
            where: { shop_domain: domain },
            attributes: ['id', 'createdAt', 'user'],
            order: [['createdAt', 'DESC']],
        });
    },
    getVersion: (id, domain) => {
        return LocatorSupportLog.findOne({
            where: { id, shop_domain: domain },
        });
    },
};
