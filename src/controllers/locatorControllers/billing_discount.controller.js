const { Sequelize } = require('sequelize');
const DiscountCodes = require('../../models')['locator'].sequelize.models.discountCodes;
const logger = require('../../log');

module.exports = {
    async getAllDiscounts(ctx) {
        try {
            const allDiscounts = await DiscountCodes.findAll({
                attributes: {
                    include: [
                        [
                            Sequelize.literal(`(
                                SELECT COUNT(*)
                                FROM discount_report AS discountReport
                                WHERE discountReport.discount_code_id = discountCodes.id
                            )`),
                            'usedDiscounts',
                        ],
                    ],
                },
            });
            ctx.body = {
                success: true,
                discounts: allDiscounts,
            };
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
    async createDiscountCode(ctx) {
        try {
            let result = {
                status: 400,
                message: 'Could not create discount code',
            };
            const data = ctx.request.body;
            if (!data.name) {
                ctx.response.status = 404;
                result.message = 'Please enter the data';
            } else {
                await DiscountCodes.create({
                    discount_name: data.name,
                    discount_code: data.discount_code,
                    status: data.status,
                    type: data.discount_type,
                    value: data.discount_value,
                    plans_from: data.plans_from,
                    plans_to: data.plans_to,
                    limit_in_intervals: data.limit_in_intervals,
                    start_date: data.start_date,
                    end_date: data.end_date,
                    unlimited_discount: data.unlimited_discount,
                    total_discount: parseInt(data.total_discount),
                }).then(function (discounts) {
                    if (discounts) {
                        ctx.response.status = 200;
                        result = {
                            success: true,
                            message: 'Create discount code successfully',
                        };
                    } else {
                        ctx.response.status = 400;
                        result.message = 'Could not create discount code';
                    }
                });
            }
            ctx.body = result;
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
    async updateDiscountCode(ctx) {
        try {
            let result = {
                success: false,
                message: 'Could not update discount code',
            };
            const data = ctx.request.body;
            if (!data.name) {
                ctx.response.status = 404;
                result.message = 'Please enter the data';
            } else {
                let currentDiscount = await DiscountCodes.findOne({
                    where: {
                        id: ctx.params.id,
                    },
                });
                if (currentDiscount) {
                    await DiscountCodes.update(
                        {
                            discount_name: data.name,
                            discount_code: data.discount_code,
                            status: data.status,
                            type: data.discount_type,
                            value: data.discount_value,
                            plans_from: data.plans_from,
                            plans_to: data.plans_to,
                            limit_in_intervals: data.limit_in_intervals,
                            start_date: data.start_date,
                            end_date: data.end_date,
                            unlimited_discount: data.unlimited_discount,
                            total_discount: parseInt(data.total_discount),
                        },
                        {
                            where: {
                                id: ctx.params.id,
                            },
                        }
                    );
                    result = {
                        success: true,
                        message: 'Updated !',
                    };
                }
            }
            ctx.body = result;
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
    async deleteDiscountCode(ctx) {
        try {
            let result = {
                status: 400,
                message: 'Could not delete discount code',
            };
            const { id } = ctx.params;
            if (!id) {
                ctx.response.status = 404;
                result.message = 'Discount not found';
            } else {
                let currentDiscount = await DiscountCodes.findOne({
                    where: {
                        id: ctx.params.id,
                    },
                });
                if (currentDiscount) {
                    await DiscountCodes.destroy({
                        where: {
                            id: ctx.params.id,
                        },
                    });
                    ctx.response.status = 200;
                    result = {
                        success: true,
                        message: 'Delete success',
                    };
                } else {
                    ctx.response.status = 404;
                    result.message = 'Discount not found';
                }
            }
            ctx.body = result;
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
};
