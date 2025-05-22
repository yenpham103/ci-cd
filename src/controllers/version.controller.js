const logger = require('../log');
const VersionService = require('../services/version.service');
const { createError } = require('../utils/error');

module.exports = {
    getList: async (ctx) => {
        const { userData, body } = ctx.request;
        const { domain, themeId, key } = body;

        try {
            const versions = await VersionService.findAll({ domain, themeId, key });

            ctx.body = {
                status: 'success',
                data: versions,
            };
            logger.debug(__filename, 'Get version list OK', userData.name, domain, themeId, key);
        } catch (error) {
            logger.error(__filename, error.message, userData.name, domain, themeId, key);
            ctx.throw(error.status, error.message);
        }
    },
    getById: async (ctx) => {
        const { params, userData } = ctx.request;
        const { id } = params;

        try {
            const version = await VersionService.findById(id);
            if (!version) {
                throw createError(400, `Version-${id} not found`);
            }

            ctx.body = {
                status: 'success',
                data: version,
            };
            logger.debug(__filename, `Version-${id} get success`, userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
    create: async (ctx) => {
        const { body, userData } = ctx.request;
        const { domain, themeId, key, content_type, value } = body;

        try {
            // Check domain and theme
            const theme = await VersionService.findOrCreateTheme({ domain, themeId });
            if (!theme) {
                throw createError(400, 'Create theme failed');
            }

            const newVersion = await VersionService.create({
                id: theme[0].id,
                asset_key: key,
                content_type,
                value,
                user_id: userData.id,
            });
            if (!newVersion || !newVersion.id) {
                throw createError(400, 'Create version failed');
            }

            const versionConvert = newVersion.get({ plain: true });
            ctx.body = {
                status: 'success',
                data: {
                    ...versionConvert,
                    user: {
                        id: userData.id,
                        name: userData.name,
                    },
                },
            };
            logger.info(__filename, `Version-${newVersion.id} create success`, userData.name, domain, themeId, key);
        } catch (error) {
            logger.error(__filename, error.message, userData.name, domain, themeId, key);
            ctx.throw(error.status, error.message);
        }
    },
};
