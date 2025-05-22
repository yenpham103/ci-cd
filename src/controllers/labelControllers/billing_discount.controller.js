const { Sequelize } = require('sequelize');
const models = require('../../models')['label'].sequelize.models;

module.exports = {
    async getAllDiscounts(ctx) {
        let result = {
            success: false,
            message: 'Could not get discounts',
        };
        try {
            const allDiscounts = await models.discountCodes.findAll({
                attributes: {
                    include: [
                        [
                            Sequelize.literal(`(
                                SELECT COUNT(*)
                                FROM discount_report AS discountReport
                                WHERE discountReport.code_id = discountCodes.id
                            )`),
                            'usedDiscounts',
                        ],
                    ],
                },
            });
            result = {
                success: true,
                discounts: allDiscounts,
            };
        } catch (e) {
            ctx.status = 400;
            result.message = e;
        }
        ctx.body = result;
    },
    async createDiscountCode(ctx) {
        let result = {
            success: false,
            message: 'Could not create discount code',
        };
        const { body: data } = ctx.request;
        try {
            if (!data.name) {
                ctx.response.status = 404;
                result.message = 'Please enter the data';
            } else {
                await models.discountCodes
                    .create({
                        discount_name: data.name,
                        status: data.status,
                        name: data.discount_code,
                        type: data.discount_type,
                        value: data.discount_value,
                        plans_from: data.plans_from,
                        plans_to: data.plans_to,
                        limit_in_intervals: data.limit_in_intervals,
                        plan_intervals: data.plan_intervals,
                        start_date: data.start_date,
                        end_date: data.end_date,
                        yearly_price_discount: data.yearly_price_discount,
                        unlimited_discount: data.unlimited_discount,
                        total_discount: parseInt(data.total_discount),
                    })
                    .then(function (discounts) {
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
        } catch (e) {
            ctx.status = 400;
            result.message = e;
        }
        ctx.body = result;
    },
    async updateDiscountCode(ctx) {
        let result = {
            success: false,
            message: 'Discount not found',
        };
        const { params, body: data } = ctx.request;
        const { id } = params;
        try {
            if (!data.name) {
                ctx.response.status = 404;
                result.message = 'Please enter the data';
            } else {
                let currentDiscount = await models.discountCodes.findOne({
                    where: {
                        id: id,
                    },
                });
                if (currentDiscount) {
                    await models.discountCodes.update(
                        {
                            discount_name: data.name,
                            status: data.status,
                            name: data.discount_code,
                            type: data.discount_type,
                            value: data.discount_value,
                            plans_from: data.plans_from,
                            plans_to: data.plans_to,
                            limit_in_intervals: data.limit_in_intervals,
                            plan_intervals: data.plan_intervals,
                            start_date: data.start_date,
                            end_date: data.end_date,
                            yearly_price_discount: data.yearly_price_discount,
                            unlimited_discount: data.unlimited_discount,
                            total_discount: parseInt(data.total_discount),
                        },
                        {
                            where: {
                                id: id,
                            },
                        }
                    );
                    ctx.response.status = 200;
                    result = {
                        success: true,
                        message: 'Updated!',
                    };
                } else {
                    ctx.response.status = 404;
                    result.message = 'Discount not found';
                }
            }
        } catch (err) {
            ctx.status = 400;
            result.message = err;
        }
        ctx.body = result;
    },
    async deleteDiscountCode(ctx) {
        let result = {
            success: false,
            message: 'Can not delete',
        };
        const { id } = ctx.params;
        try {
            if (id) {
                let currentDiscount = await models.discountCodes.findOne({
                    where: {
                        id: id,
                    },
                });
                if (currentDiscount) {
                    await models.discountCodes.destroy({
                        where: {
                            id: id,
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
        } catch (err) {
            ctx.status = 400;
            result.message = err;
        }
        ctx.body = result;
    },
    async getAllDiscountReports(ctx) {
        let result = {
            success: false,
            message: 'Could not get discounts report',
        };
        try {
            const discountReports = await models.discountReport.findAll({
                include: [models.discountCodes],
                order: [['id', 'ASC']],
            });
            result = {
                success: true,
                discounts: discountReports,
            };
        } catch (e) {
            result.message = e;
        }
        ctx.body = result;
    },
};
