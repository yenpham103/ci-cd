const Module = require('../models')['support'].sequelize.models.modules;
const App = require('../models')['support'].sequelize.models.apps;

module.exports = {
    create: async ({ name, app_id }) => {
        return await Module.create({ name, app_id });
    },
    findAll: async ({ limit, offset, app_id = null }) => {
        return await Module.findAndCountAll({
            limit,
            offset,
            where: { app_id },
        });
    },
    findOne: async (filter) => {
        return await Module.findOne({
            where: filter,
            include: {
                model: App,
            },
        });
    },
};
