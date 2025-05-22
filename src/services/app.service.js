const App = require('../models')['support'].sequelize.models.apps;

module.exports = {
    create: async ({ name }) => {
        return await App.create({ name });
    },
    findAll: async ({ appIds, limit, offset, status }) => {
        let where = {};
        if (status) {
            where.status = status;
        }
        if (appIds) {
            where.id = appIds;
        }
        return await App.findAndCountAll({
            limit,
            offset,
            where,
        });
    },

    findOne: async (id) => {
        return await App.findOne({
            where: { id: parseInt(id) },
        });
    },
};
