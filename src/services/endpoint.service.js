const { Op } = require('sequelize');

const Endpoint = require('../models')['support'].sequelize.models.endpoints;
const Module = require('../models')['support'].sequelize.models.modules;
const App = require('../models')['support'].sequelize.models.apps;
const User = require('../models')['support'].sequelize.models.users;
const Sequelize = require('sequelize');

module.exports = {
    create: async ({ method, url, status, module_id, user_id }) => {
        return await Endpoint.create({ method, url, status, module_id, user_id });
    },
    delete: async (id) => {
        return await Endpoint.destroy({ where: { id } });
    },
    findAll: async ({ limit, offset, url, module_id, models, app_id, method, status }, options = {}) => {
        let where = {
            url: { [Op.like]: `%${url}%` },
        };
        let include = [
            {
                model: Module,
                include: [
                    {
                        model: App,
                    },
                ],
            },
        ];

        if (method) {
            where.method = method;
        }

        if (status) {
            where.status = status;
        }

        if (app_id && module_id) {
            where.module_id = module_id;
            where['$module.app.id$'] = app_id;
        } else if (app_id) {
            where.module_id = {
                [Op.in]: Sequelize.literal(`(SELECT id FROM modules WHERE app_id = ${app_id} AND app_id IS NOT NULL)`),
            };
        }

        if (models?.includes('user')) {
            include.push({
                model: User,
                attributes: ['id', 'name', 'email'],
            });
        }

        return await Endpoint.findAndCountAll({
            where,
            limit,
            offset,
            include,
            ...options,
        });
    },
    findAllByApp: async ({ status, name }) => {
        return await Endpoint.findAll({
            where: {
                status,
            },
            include: [
                {
                    model: Module,
                    include: [
                        {
                            model: App,
                            where: {
                                name,
                            },
                            required: true,
                        },
                    ],
                    required: true,
                },
            ],
        });
    },
    findById: async (id, options = {}) => {
        return await Endpoint.findByPk(id, {
            include: [
                {
                    model: Module,
                    include: [
                        {
                            model: App,
                        },
                    ],
                },
            ],
            ...options,
        });
    },
    update: async (filter, data) => {
        return await Endpoint.update(data, { where: filter });
    },
};
