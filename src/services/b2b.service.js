const models = require('../models')['solution'].sequelize.models;
const crypto = require('crypto');
const { B2B_SOLUTION_API_URL, B2B_SECRET_KEY } = process.env;
const logger = require('../log');

module.exports = {
    findByDomain: async (domain) => {
        let result = null;
        try {
            result = models.b2bSupport.findOne({ where: { shop_domain: domain } });
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
            const HMAC = crypto.createHmac('sha256', B2B_SECRET_KEY).update(body).digest('hex');
            const response = await fetch(`${B2B_SOLUTION_API_URL}/support?domain=${domain}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-hmac-sign': HMAC,
                },
                body,
            });
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
            result = models.b2bSupportLogs.findAll({
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
            result = models.b2bSupportLogs.findOne({
                where: { id, shop_domain: domain },
            });
        } catch (error) {
            throw new Error(error);
        }
        return result;
    },
};
