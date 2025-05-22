const models = require('../../models')['label'].sequelize.models;

module.exports = {
    async getAllDiscountReports(ctx) {
        const discountReports = await models.discountReport.findAll({
            include: [models.discountCodes],
            order: [['id', 'ASC']],
        });
        ctx.body = {
            success: true,
            discounts: discountReports,
        };
    },
};
