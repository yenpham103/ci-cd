const models = require('../models')['label'].sequelize.models;

const getAllReviewedCustomers = async (ctx) => {
    try {
        const data = await models.reviewed_customer.findAll();

        ctx.status = 200;
        ctx.body = {
            message: 'Success',
            success: true,
            data: data,
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            message: 'Error fetching reviewed customers',
            success: false,
            error: error.message,
        };
    }
};

const getReviewedByDomain = async (ctx) => {
    const domain = ctx.request.shop_domain;
    try {
        const data = await models.reviewed_customer.findOne({
            where: { domain: domain },
        });

        ctx.status = 200;
        ctx.body = {
            success: true,
            is_reviewed: !!data,
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            message: 'Error fetching reviewed customers',
            error: error.message,
            success: false,
        };
    }
};

const getDataShopByDomain = async (ctx) => {
    try {
        const { domain } = ctx.request.body;

        const shopData = await models.shops.findOne({
            where: { domain },
            attributes: ['domain', 'first_name', 'last_name', 'email'],
        });

        ctx.status = 200;
        if (!shopData) {
            ctx.body = { message: 'No valid domain found.', success: true };
            return;
        }

        const reviewData = await models.reviewed_customer.findOne({
            where: { domain },
            attributes: ['is_review'],
        });

        ctx.body = reviewData?.is_review
            ? { message: 'Domain has been reviewed.', success: true }
            : { data: shopData, success: true };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: 'Error searching shop information by domain.', success: false };
    }
};

const addDomains = async (ctx) => {
    try {
        const { listDomains } = ctx.request.body;
        await models.reviewed_customer.bulkCreate(listDomains);
        ctx.status = 201;
        ctx.body = { message: 'Add domain successfully', success: true };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: 'Error add domain.', error: error.message, success: false };
    }
};

const deleteDomain = async (ctx) => {
    try {
        const { domain } = ctx.request.body;

        const deletedCount = await models.reviewed_customer.destroy({
            where: { domain },
        });

        if (deletedCount > 0) {
            ctx.status = 200;
            ctx.body = { message: `Domain deleted successfully.`, success: true };
        } else {
            ctx.status = 404;
            ctx.body = { message: `Domain not found.`, success: true };
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            message: 'Error deleting domain.',
            error: error.message,
            success: false,
        };
    }
};

module.exports = {
    getAllReviewedCustomers,
    getReviewedByDomain,
    getDataShopByDomain,
    addDomains,
    deleteDomain,
};
