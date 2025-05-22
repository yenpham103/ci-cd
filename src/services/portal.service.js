const models = require('../models')['portal'].sequelize.models;
const crypto = require('crypto');
const { PORTAL_API_URL, PORTAL_SECRET_KEY } = process.env;
const logger = require('../log');

module.exports = {
    findByDomain: async (domain) => {
        let result = null;
        try {
            result = models.portalSupport.findOne({ where: { shop_domain: domain } });
        } catch (error) {
            logger.error(__filename, error.message, '', domain);
        }
        return result;
    },

    updateContent: async (domain, content, user) => {
        let result = {
            success: false,
            message: `Could not update support content`,
        };
        try {
            const body = JSON.stringify({ domain, content, user });
            const HMAC = crypto.createHmac('sha256', PORTAL_SECRET_KEY).update(body).digest('hex');
            const response = await fetch(`${PORTAL_API_URL}/support?domain=${domain}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-hmac-sign': HMAC,
                },
                body,
            });
            console.log('response : ', response);
            if (response.ok) {
                result = await response.json();
            } else {
                let message = response.statusText;
                if (response.status === 400) {
                    message = (await response.json()).message;
                }
                throw new Error(message);
            }
        } catch (error) {
            throw new Error(error);
        }
        return result;
    },

    getVersionList: async (domain, limit) => {
        let result = null;
        try {
            result = models.portalSupportLogs.findAll({
                limit,
                where: { shop_domain: domain },
                attributes: ['id', 'createdAt', 'user'],
                order: [['createdAt', 'DESC']],
            });
        } catch (error) {
            throw new Error(error);
        }
        return result;
    },

    getVersion: async (id, domain) => {
        let result = null;
        try {
            result = models.portalSupportLogs.findOne({
                where: { id, shop_domain: domain },
            });
        } catch (error) {
            throw new Error(error);
        }
        return result;
    },
};
