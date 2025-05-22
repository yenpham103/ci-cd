const { updateAppSubscriptionTrialExtend } = require('../../graphql/mutation/billing.mutation');
const models = require('../../models')['label'].sequelize.models;

module.exports = {
    async updateExtendTrial(ctx) {
        let result = {
            success: false,
            message: 'Shop information does not exist!',
        };

        try {
            const data = ctx.request.body;

            const shopData = await models.shops.findOne({
                where: {
                    domain: data.domain,
                },
            });

            if (shopData?.charge_id) {
                const extendTrialRes = await updateAppSubscriptionTrialExtend(
                    data.domain,
                    shopData.token,
                    shopData.charge_id,
                    +data.days
                );
                const dataRes = extendTrialRes?.data?.appSubscriptionTrialExtend;

                ctx.status = 200;
                if (dataRes.appSubscription?.status === 'ACTIVE') {
                    await models.shops.update(
                        {
                            remain_trial_days: parseInt(data.days),
                        },
                        {
                            where: {
                                domain: data.domain,
                            },
                        }
                    );

                    result.success = true;
                    result.message = 'Update trial extend successfully.';
                } else if (dataRes.userErrors.length > 0) {
                    result.message = dataRes.userErrors[0].message;
                }
            }
        } catch (error) {
            ctx.status = 500;
            result.message = error;
        }

        ctx.body = result;
    },
};
