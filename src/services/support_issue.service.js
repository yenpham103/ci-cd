const { Op, Sequelize } = require('sequelize');

const User = require('../models')['support'].sequelize.models.users;
const SupportIssue = require('../models')['support'].sequelize.models.support_issues;
const SupportIssueReact = require('../models')['support'].sequelize.models.support_issues_reacts;

module.exports = {
    updateOne: async (filter, data) => {
        return await SupportIssue.update(data, { where: filter });
    },

    create: async (data) => {
        return await SupportIssue.create(data);
    },

    update: async (filter, data) => {
        return await SupportIssue.update(data, filter);
    },

    upsert: async (data) => {
        return await SupportIssue.upsert(data, {
            conflictPaths: [`id`],
            skipUpdateIfNoValuesChanged: true,
            upsertType: 'on-duplicate-key-update',
        });
    },

    delete: async (id) => {
        return await SupportIssue.destroy({ where: { id } });
    },

    findOne: async ({ where, options = {} }) => {
        return await SupportIssue.findOne({
            where,
            include: [
                {
                    model: User,
                    as: 'report',
                    attributes: ['id', 'name', 'role'],
                },
            ],
            ...options,
        });
    },

    findAll: async ({ title, app, module, order, options = {} }) => {
        let whereCondition = {
            title: { [Op.like]: `%${title}%` },
            app_id: app,
        };
        if (module && module !== 'all') {
            whereCondition = {
                ...whereCondition,
                module_id: parseInt(module),
            };
        }
        return await SupportIssue.findAll({
            where: {
                ...whereCondition,
            },
            include: [
                {
                    model: User,
                    as: 'report',
                    attributes: ['id', 'name', 'role'],
                },
                {
                    model: SupportIssueReact,
                    as: 'react',
                },
            ],
            attributes: [
                'id',
                'title',
                'solution',
                'createdAt',
                [
                    Sequelize.literal(
                        '(SELECT COUNT(*) FROM support_issues_reacts WHERE support_issues_reacts.state = true AND support_issues_reacts.issue_id = support_issues.id)'
                    ),
                    'agree',
                ],
                [
                    Sequelize.literal(
                        '(SELECT COUNT(*) FROM support_issues_reacts WHERE support_issues_reacts.state = false AND support_issues_reacts.issue_id = support_issues.id)'
                    ),
                    'disagree',
                ],
            ],
            order: order,
            // [[Sequelize.literal('agree'), 'DESC']],
            // [['createdAt', 'DESC']],
            ...options,
        });
    },

    findCountByAppModule: async ({ app, module }) => {
        let whereCondition = {
            app_id: app,
        };
        if (module && module !== 'all') {
            whereCondition = {
                module_id: parseInt(module),
            };
        }
        return await SupportIssue.count({
            where: {
                ...whereCondition,
            },
        });
    },
};
