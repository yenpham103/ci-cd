const models = require('../models')['option'].sequelize.models;
const crypto = require('crypto');

module.exports = {
    findByDomain: (domain) => {
        return models.optionSupport.findOne({ where: { shop_domain: domain } });
    },
    updateContent: async (domain, content, user) => {
        const endpoint = process.env.OPTION_API_URL + '/support/';
        const body = JSON.stringify({ domain, content, user });
        const hmac = crypto.createHmac('sha256', process.env.OPTION_SECRET_KEY).update(body).digest('hex');
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
        return models.optionSupportLogs.findAll({
            limit,
            where: { shop_domain: domain },
            attributes: ['id', 'createdAt', 'user'],
            order: [['createdAt', 'DESC']],
        });
    },
    getVersion: (id, domain) => {
        return models.optionSupportLogs.findOne({
            where: { id, shop_domain: domain },
        });
    },
};
