const label = require('../models')['label'].sequelize.models.labels;

const getPrimaryImageByID = async (ctx) => {
    try {
        const param = ctx.params;
        const isBackground = ctx.query.isBackground;
        const arrLibId = param.arrLibId.split(',');
        let result = [];

        for (const element of arrLibId) {
            const labels = await label.findOne({
                where: {
                    lib_id: parseInt(element),
                    is_background: parseInt(isBackground),
                },
            });
            if (labels) {
                result.push({
                    lib_id: labels.lib_id,
                    public_url: labels.public_url,
                });
            }
        }

        ctx.status = 200;
        if (result.length) {
            ctx.body = {
                success: true,
                message: 'get primary image lib success',
                result,
            };
        } else {
            ctx.body = {
                success: false,
                message: 'get primary image lib failed',
                result,
            };
        }
    } catch (err) {
        ctx.status = 400;
        ctx.body = { message: err, success: false };
    }
};

const getLabelLibByID = async (ctx) => {
    try {
        const param = ctx.params;
        const libId = param.libId;
        const labels = await label.findAll({
            where: {
                lib_id: libId,
            },
        });
        ctx.body = {
            labels,
            success: true,
        };
        ctx.status = 200;
    } catch (err) {
        ctx.status = 400;
        ctx.body = { message: err, success: false };
    }
};

const bulkUpdate = async (ctx) => {
    let data = ctx.request.body;
    try {
        for (let i = 0; i < data.idLabels.length; i++) {
            let currentImage = await label.findOne({
                where: {
                    id: data.idLabels[i],
                },
            });

            if (currentImage) {
                if (!data.name) {
                    await label.update(
                        {
                            enable: parseInt(data.enable),
                            sort_order: parseInt(data.sort_order),
                            lib_id: parseInt(data.lib_id),
                        },
                        {
                            where: {
                                id: data.idLabels[i],
                            },
                        }
                    );
                } else {
                    await label.update(
                        {
                            name: data.name,
                            enable: parseInt(data.enable),
                            sort_order: parseInt(data.sort_order),
                            lib_id: parseInt(data.lib_id),
                            ratio: data.ratio ? parseFloat(data.ratio) : 0,
                            show_trending: data.show_trending ? data.show_trending : false,
                        },
                        {
                            where: {
                                id: data.idLabels[i],
                            },
                        }
                    );
                }
            }
        }
        ctx.response.status = 200;
        ctx.body = {
            success: true,
            message: 'update success',
        };
    } catch (err) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: err,
        };
    }
};

const bulkDelete = async (ctx) => {
    let data = ctx.request.body;
    try {
        if (data.idLabels.length) {
            let deleted = await label.destroy({ where: { id: data.idLabels } });
            if (deleted) {
                ctx.response.status = 200;
                ctx.body = {
                    success: true,
                    message: 'bulk delete success',
                };
            }
        } else {
            ctx.response.status = 400;
            ctx.body = {
                success: false,
                message: 'bulk delete failed',
            };
        }
    } catch (err) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: err,
        };
    }
};

const getLabelByID = async (ctx) => {
    let data = ctx.request.body;
    try {
        if (!data.name || !data.path) {
            ctx.response.status = 404;
            ctx.body = {
                message: 'Please enter the data',
                success: false,
            };
        } else {
            let currentImage = await label.findOne({
                where: {
                    id: ctx.params.id,
                },
            });
            if (currentImage) {
                await label.update(
                    {
                        name: data.name,
                        path: data.path,
                        enable: data.enable,
                        sort_order: data.sort_order,
                        lib_id: data.lib_id,
                    },
                    {
                        where: {
                            id: ctx.params.id,
                        },
                    }
                );
                ctx.response.status = 200;
                ctx.body = {
                    message: 'Update successfully.',
                    success: true,
                };
            } else {
                ctx.response.status = 404;
                ctx.body = {
                    message: 'Image not found',
                    success: false,
                };
            }
        }
    } catch (err) {
        ctx.status = 400;
        ctx.body = { message: err, success: false };
    }
};

const deleteLabel = async (ctx) => {
    let result = {
        success: false,
        message: 'Something went wrong!',
    };
    let data = ctx.request.body;
    try {
        if (!data.id) {
            ctx.response.status = 404;
            result.message = 'id label not empty';
        } else {
            let labelFound = await label.findOne({ id: data.id });
            if (labelFound) {
                await label.destroy({ where: { id: data.id } });
                ctx.response.status = 200;
                result.message = 'deleted label';
                result.success = true;
            } else {
                ctx.response.status = 404;
                result.message = ' label not found';
            }
        }
    } catch (err) {
        ctx.status = 400;
        result.message = err;
    }
    ctx.response.body = result;
};

module.exports = {
    getPrimaryImageByID,
    getLabelLibByID,
    bulkUpdate,
    bulkDelete,
    getLabelByID,
    deleteLabel,
};
