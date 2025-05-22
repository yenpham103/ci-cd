const logger = require('../log');
const { TaxShopify } = require('../shopify-api');

module.exports = {
    getList: async (ctx) => {
        const { userData, body, shop } = ctx.request;
        const { domain } = body;
        const fields = 'id,name,code,tax_name,tax';

        try {
            const { token } = shop;
            const taxes = await TaxShopify.getAllCountries({ domain, token, fields });

            ctx.body = {
                status: 'success',
                data: taxes.countries,
            };
            logger.info(__filename, 'Get all tax', userData.name, domain);
        } catch (error) {
            logger.error(__filename, error.message, userData.name, domain);
            ctx.throw(error.status, error.message);
        }
    },
    getById: async (ctx) => {
        const { userData, body, shop } = ctx.request;
        const { domain, id } = body;

        try {
            const { token } = shop;
            const tax = await TaxShopify.getCountryById({ domain, token, id });

            ctx.body = {
                status: 'success',
                data: tax.country,
            };
            logger.info(__filename, 'Get tax by id', userData.name, domain);
        } catch (error) {
            logger.error(__filename, error.message, userData.name, domain);
            ctx.throw(error.status, error.message);
        }
    },
};
