const logger = require('../log');
const { ADMIN_ROLE, CSE_ROLE } = require('../constants/shop.constant');
const supportIssueService = require('../services/support_issue.service');
const { hasPermissionWithType } = require('../utils/convertPermission');
const { createError } = require('../utils/error');
const moduleService = require('../services/module.service');
const issueReactService = require('../services/support_issue_react.service');
const { Sequelize } = require('sequelize');
const { PERMISSION } = require('../constants/app.constant');
const { getKeyByValue } = require('../utils/getKeyByValue');

const excludePermissionRule = [ADMIN_ROLE, CSE_ROLE];

module.exports = {
    getList: async function (ctx) {
        const { query, userData } = ctx.request;
        let { title, module, limit, page, app, order } = query;

        const _page = page && parseInt(page);
        const _limit = limit && parseInt(limit);

        try {
            if (!excludePermissionRule.includes(userData.role)) {
                if (!hasPermissionWithType(userData, app)) {
                    throw createError(403, 'Not permissions');
                }
            }
            //convert app_type to app_id
            app = PERMISSION[app];

            // [[Sequelize.literal('agree'), 'DESC']],
            // [['createdAt', 'DESC']],
            let orderCondition = [['createdAt', 'DESC']];

            if (order === 'agree') {
                orderCondition = [[Sequelize.literal('agree'), 'DESC']];
            }

            const issues = await supportIssueService.findAll({
                title,
                app,
                module,
                order: orderCondition,
                options: {
                    limit: _limit,
                    offset: (_page - 1) * _limit,
                },
            });
            const count = await supportIssueService.findCountByAppModule({ app, module });
            if (!issues) {
                throw createError(404, 'Issues not found');
            }

            ctx.status = 200;
            ctx.body = {
                status: 'success',
                data: issues,
                pagination: {
                    page: _page,
                    limit: _limit,
                    totalRecords: count,
                },
            };
            logger.debug(__filename, `${app}: Get list success`, userData.name, userData.domain);
        } catch (error) {
            logger.error(__filename, error.message, userData.name, userData.domain);
            ctx.throw(error.status, error.message);
        }
    },

    getById: async function (ctx) {
        const { params, userData } = ctx.request;
        let { id } = params;

        try {
            if (!id) {
                throw createError(400, 'Invalid Id');
            }

            const data = await supportIssueService.findOne({ where: { id: id } });
            if (data) {
                data.dataValues.app_type = getKeyByValue(PERMISSION, data?.app_id);
            }
            ctx.status = 200;
            ctx.body = {
                status: 'success',
                data: data,
            };
            logger.debug(__filename, `Get by id success`, userData.name, userData.domain);
        } catch (error) {
            logger.error(__filename, error.message, userData.name, userData.domain);
            ctx.throw(error.status, error.message);
        }
    },

    updateReact: async function (ctx) {
        const { body, userData } = ctx.request;
        const { type, id, state } = body;

        try {
            if (!excludePermissionRule.includes(userData.role)) {
                if (type && !hasPermissionWithType(userData, type)) {
                    throw createError(403, 'Not permissions');
                }
            }
            await issueReactService.upsert({ user_id: userData.id, issue_id: id, state: state });

            ctx.status = 200;
            ctx.body = {
                status: 'success',
                message: 'Mew Mew !!.Thanks for your reaction',
            };
            logger.debug(__filename, `${type}: update react success`, userData.name, userData.domain);
        } catch (error) {
            logger.error(__filename, error.message, userData.name, userData.domain);
            ctx.throw(error.status, error.message);
        }
    },

    create: async function (ctx) {
        const { body, userData } = ctx.request;
        const { title, solution, module, app } = body;

        try {
            if (!excludePermissionRule.includes(userData.role)) {
                if (!app || !hasPermissionWithType(userData, app)) {
                    throw createError(403, 'Not permissions');
                }
            }

            if (!title || !module) {
                throw createError(400, 'Invalid title or module');
            }

            const moduleData = await moduleService.findOne({ id: parseInt(module) });
            if (moduleData) {
                await supportIssueService.create({
                    title,
                    solution,
                    app_id: moduleData.app.dataValues.id,
                    module_id: moduleData.id,
                    reporter: userData.id,
                });

                ctx.status = 200;
                ctx.body = {
                    status: 'success',
                    message: `Create support issue successful!`,
                };
            }
        } catch (error) {
            logger.error(__filename, error.message, userData.name, userData.domain);
            ctx.throw(error.status, error.message);
        }
    },

    update: async function (ctx) {
        const { body, params, userData } = ctx.request;
        const { title, solution, module, app } = body;
        const { id } = params;

        try {
            if (!excludePermissionRule.includes(userData.role)) {
                if (!app || !hasPermissionWithType(userData, app)) {
                    throw createError(403, 'Not permissions');
                }
            }

            //convert app_type to app_id
            const app_id = PERMISSION[app];

            if (!title || !module) {
                throw createError(400, 'Invalid title or module');
            }

            if (id && app_id) {
                const supportIssue = await supportIssueService.findOne({ where: { id: id } });
                if (!supportIssue) {
                    throw createError(400, 'Invalid id');
                }

                if (supportIssue?.report.id !== userData.id) {
                    throw createError(403, 'Not edit permission');
                }
            } else {
                throw createError(400, 'Id and App Type is required');
            }
            await supportIssueService.update(
                { where: { id: id } },
                {
                    title,
                    solution,
                    app_id: app_id,
                    module_id: parseInt(module),
                    reporter: userData.id,
                }
            );

            ctx.status = 200;
            ctx.body = {
                status: 'success',
                message: `Update support issue successful!`,
            };
        } catch (error) {
            logger.error(__filename, error.message, userData.name, userData.domain);
            ctx.throw(error.status, error.message);
        }
    },

    deleteById: async function (ctx) {
        const { params, userData } = ctx.request;
        const { id } = params;
        try {
            await supportIssueService.delete(parseInt(id));
            ctx.status = 200;
            ctx.body = {
                status: 'success',
                message: `Delete support issue successful!`,
            };
        } catch (error) {
            logger.error(__filename, error.message, userData.name, userData.domain);
            ctx.throw(error.status, error.message);
        }
    },
};
