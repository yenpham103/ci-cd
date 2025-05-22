const LocatorService = require('../../services/locator.service.js');
const logger = require('../../log');

module.exports = {
    extendStoreLimit: async (ctx) => {
        const { quantity } = ctx.request.body;
        const { domain } = ctx.params;
        try {
            if (+quantity < 0) {
                ctx.status = 203;
                ctx.body = { message: 'Quantity is invalid' };
                return;
            }
            const shopData = await LocatorService.findShopByDomain({ domain: domain, select: ['id', 'plan_code'] });
            if (!shopData) {
                ctx.status = 203;
                ctx.body = { message: 'Domain not found' };
                return;
            }
            if (shopData.plan_code === 'platinum') return 'This shop is on the Platinum plan';
            await LocatorService.updateOneById({
                id: shopData.id,
                obj: { extend_store_limit: parseInt(quantity) || 0 },
            });
            ctx.body = { message: 'Store limit extended successfully' };
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },

    checkShopInfo: async (ctx) => {
        try {
            const { domain = '' } = ctx.params;
            const shopData = await LocatorService.findShopByDomain({ domain });
            if (!shopData) {
                ctx.status = 203;
                ctx.body = { message: 'Domain not found' };
                return;
            }
            ctx.body = shopData;
        } catch (error) {
            ctx.status = 500;
            ctx.body = { message: error.message };
        }
    },
};
