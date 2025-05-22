const Theme = require('../models')['support'].sequelize.models.themes;
const Version = require('../models')['support'].sequelize.models.versions;
const User = require('../models')['support'].sequelize.models.users;

module.exports = {
    findAll: async ({ domain, themeId, key }) => {
        return await Version.findAll({
            attributes: ['id', 'asset_key', 'user_id', 'createdAt'],
            where: { asset_key: key },
            include: [
                {
                    model: Theme,
                    where: {
                        domain,
                        theme_id: themeId,
                    },
                },
                {
                    model: User,
                    attributes: ['id', 'name'],
                },
            ],
        });
    },
    findById: async (id, options = {}) => {
        return await Version.findByPk(id, options);
    },
    create: async ({ id, asset_key, content_type, value, user_id }, options = {}) => {
        return await Version.create({ theme_id: id, asset_key, content_type, value, user_id }, options);
    },
    findOrCreateTheme: async ({ domain, themeId }) => {
        return await Theme.findOrCreate({
            where: {
                domain,
                theme_id: themeId,
            },
            defaults: {
                domain,
                theme_id: themeId,
            },
        });
    },
};
