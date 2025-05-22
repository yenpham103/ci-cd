const PartnerApps = require('../../models')['label'].sequelize.models.partnerApps;
const logger = require('../../log');

module.exports = {
    getPartnerApps: async (ctx) => {
        try {
            const data = await PartnerApps.findAll();
            ctx.body = {
                success: true,
                data: data,
            };
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
    createPartnerApp: async (ctx) => {
        try {
            const partner = PartnerApps.create(ctx.request.body);
            ctx.body = {
                success: true,
                data: partner,
            };
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
    updatePartnerApp: async (ctx) => {
        try {
            const partnerId = ctx.params.id;
            const partner = await PartnerApps.update(ctx.request.body, {
                where: {
                    id: partnerId,
                },
            });
            ctx.body = {
                success: true,
                data: partner,
            };
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
    deletePartnerApp: async (ctx) => {
        try {
            const partnerId = ctx.params.id;
            const currentApp = await PartnerApps.findOne({
                where: {
                    id: partnerId,
                },
            });
            if (currentApp) {
                await PartnerApps.destroy({
                    where: {
                        id: partnerId,
                    },
                });
                ctx.response.status = 200;
                ctx.body = {
                    success: true,
                    message: 'Delete success',
                };
            } else {
                ctx.response.status = 404;
                ctx.body = 'App not found';
            }
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
};
