const { Op } = require('sequelize');
const moduleLabel = require('../models')['label'].sequelize.models;

module.exports = {
    getCustomerLabel: async function (ctx) {
        try {
            let { key, page, pageSize, startDate, endDate } = ctx.request.query;
            if (!key) {
                key = '';
            }
            if (!page) {
                page = 1;
            }
            if (!pageSize) {
                pageSize = 10;
            }
            if (!startDate) {
                startDate = new Date('2016-01-01').setUTCHours(0, 0, 0, 0);
            } else {
                startDate = new Date(startDate).setUTCHours(0, 0, 0, 0);
            }
            if (!endDate) {
                endDate = new Date('2030-01-01').setUTCHours(23, 59, 59, 999);
            } else {
                endDate = new Date(endDate).setUTCHours(23, 59, 59, 999);
            }
            let labels1 = await moduleLabel.customerLabels.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate,
                    },
                },
                // eslint-disable-next-line no-console
                logging: console.log,
            });

            let filterLabels = labels1.filter(
                (label) => label.name.toLowerCase().includes(key.toLowerCase()) && label.public_url
            );
            let total = filterLabels.length;
            let fromIndex = (page - 1) * pageSize;
            let endIndex = page * pageSize;
            if (endIndex > total) {
                endIndex = total;
            }
            filterLabels = filterLabels.filter((_, index) => index >= fromIndex && index < endIndex);
            ctx.response.status = 200;
            ctx.body = {
                success: true,
                data: filterLabels,
                key,
                page,
                pageSize,
                total,
            };
        } catch (error) {
            ctx.status = 400;
            ctx.body = { message: error };
        }
    },

    copyToLib: async function (ctx) {
        try {
            let data = ctx.request.body;
            let strPublicUrl = data.public_url;
            let publicUrl = data.public_url.split(',');
            let labelsCreate = [];
            if (strPublicUrl.length) {
                for (let i = 0; i < publicUrl.length; i++) {
                    let urlArr = publicUrl[i].split('/');
                    let name = urlArr[urlArr.length - 1];
                    labelsCreate.push({
                        name: name,
                        path: name,
                        enable: 1,
                        lib_id: data.lib_id,
                        public_url: publicUrl[i],
                    });
                }
                if (labelsCreate.length) {
                    let res = await moduleLabel.labels.bulkCreate(labelsCreate);
                    if (res) {
                        ctx.response.status = 200;
                        ctx.body = {
                            success: true,
                            message: 'Created label in lib',
                        };
                    } else {
                        ctx.response.status = 400;
                        ctx.body = {
                            success: true,
                            message: 'Failed create label in lib',
                        };
                    }
                }
            } else {
                ctx.response.status = 400;
                ctx.body = {
                    success: false,
                    message: 'Do not file selected',
                };
            }
        } catch (err) {
            console.log(err, 'err');
            ctx.status = 400;
            ctx.body = { message: err };
        }
    },
};
