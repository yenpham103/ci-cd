const DiscountReport = require('../../models')['locator'].sequelize.models.discountReport;
const DiscountCodes = require('../../models')['locator'].sequelize.models.discountCodes;
const logger = require('../../log');

module.exports = {
    async getAllDiscountReports(ctx) {
        try {
            const discountReports = await DiscountReport.findAll({
                include: [DiscountCodes],
                order: [['id', 'ASC']],
            });
            ctx.body = {
                success: true,
                discounts: discountReports,
            };
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
};
