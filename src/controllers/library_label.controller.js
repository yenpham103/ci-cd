const { Sequelize } = require('sequelize');
const labels = require('../models')['label'].sequelize.models.labels;
const libs = require('../models')['label'].sequelize.models.libs;

const getLabelLibs = async (ctx) => {
    try {
        const isBackground = ctx.query.isBackground;

        const libraries = await libs.findAll({
            where: {
                is_background: parseInt(isBackground),
            },
            attributes: {
                include: [[Sequelize.fn('COUNT', Sequelize.col('labels.id')), 'imageCount']],
            },
            include: [
                {
                    model: labels,
                    attributes: [],
                },
            ],
            group: ['libs.id'],
        });
        ctx.status = 200;
        ctx.body = {
            libraries,
            status: true,
        };
    } catch (err) {
        ctx.status = 400;
        ctx.body = { message: err, status: false };
    }
};

const createLabelLib = async (ctx) => {
    let result = {
        status: false,
        message: 'Something went wrong!',
    };
    let data = ctx.request.body;
    try {
        if (!data.name || !data.sort_order) {
            ctx.response.status = 404;
            result.message = 'Name and sort order not empty';
        } else {
            let libCreated = await libs.create({
                name: data.name,
                sort_order: data.sort_order,
                enable: data.enable,
                plan_id: data.plan_id,
                is_background: data.is_background,
            });
            if (libCreated) {
                ctx.response.status = 200;
                result.message = 'Created lib';
                result.status = true;
            }
        }
    } catch (err) {
        ctx.status = 400;
        result.message = err;
    }
    ctx.response.body = result;
};

const updateLabelLib = async (ctx) => {
    let data = ctx.request.body;
    try {
        if (!data.name || !data.sort_order) {
            ctx.response.status = 404;
            ctx.body = 'Please enter the data';
        } else {
            let currentLib = await libs.findOne({
                where: {
                    id: ctx.params.id,
                },
            });
            if (currentLib) {
                await libs.update(
                    {
                        name: data.name,
                        sort_order: data.sort_order,
                        enable: data.enable,
                        plan_id: data.plan_id,
                    },
                    {
                        where: {
                            id: ctx.params.id,
                        },
                    }
                );
                ctx.response.status = 200;
                ctx.body = {
                    message: 'Updated lib',
                    status: true,
                };
            } else {
                ctx.response.status = 404;
                ctx.body = {
                    message: 'Image not found',
                    status: false,
                };
            }
        }
    } catch (err) {
        ctx.status = 400;
        ctx.body = { message: err };
    }
};

const deleteLabelLib = async (ctx) => {
    let result = {
        status: false,
        message: 'Something went wrong!',
    };
    let data = ctx.request.body;

    try {
        if (!data.id) {
            ctx.response.status = 404;
            result.message = 'id lib not empty';
        } else {
            let lib = await libs.findOne({ id: data.id });
            if (lib) {
                await libs.destroy({ where: { id: data.id } });
                ctx.response.status = 200;
                result.message = 'deleted lib';
                result.status = true;
            } else {
                ctx.response.status = 404;
                result.message = ' lib not found';
            }
        }
    } catch (err) {
        ctx.status = 400;
        result.message = err;
    }
    ctx.response.body = result;
};

module.exports = { getLabelLibs, createLabelLib, deleteLabelLib, updateLabelLib };
