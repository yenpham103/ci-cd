/*eslint no-unreachable: "error"*/
const logger = require('../log');
const ThemeService = require('../services/theme.service');
const { createError } = require('../utils/error');
const { DOWNLOAD_THEME_QUEUE } = require('../constants/rabbitmq.constant');
const { publishRabbitMessage } = require('../config/rabbitmq/publishs');

module.exports = {
    getList: async (ctx) => {
        const { body, userData, shop } = ctx.request;
        const { domain, role } = body;

        try {
            const { token } = shop;

            const themes = await ThemeService.findAll({
                domain,
                token,
                query: { role },
            });
            if (!themes) {
                throw createError(404, 'Themes not found');
            }

            ctx.body = {
                status: 'success',
                data: themes.themes,
            };
            logger.debug(__filename, 'Get list theme success', userData.name, domain);
        } catch (error) {
            logger.error(__filename, error.message, userData.name, domain);
            ctx.throw(error.status, error.message);
        }
    },
    getAssetList: async (ctx) => {
        const { body, shop, userData } = ctx.request;
        const { domain, themeId } = body;

        try {
            const { token } = shop;

            const data = await ThemeService.findAllAsset({ domain, token, themeId });
            if (!data || !data.assets) {
                throw createError(404, 'Assets not found');
            }

            ctx.body = {
                status: 'success',
                data: data.assets,
            };
            logger.debug(__filename, 'Get asset list success', userData.name, domain, themeId);
        } catch (error) {
            logger.error(__filename, error.message, userData.name, domain, themeId);
            ctx.throw(error.status, error.message);
        }
    },
    getContentAsset: async (ctx) => {
        const { body, userData, shop } = ctx.request;
        const { domain, themeId, key } = body;

        try {
            const { token } = shop;
            const data = await ThemeService.findSingleAsset({ domain, token: token, themeId, key });
            if (!data || !data.asset) {
                throw createError(404, 'Asset not found');
            }

            ctx.body = {
                status: 'success',
                data: data.asset,
            };
            logger.debug(__filename, 'Get content asset success', userData.name, domain, themeId, key);
        } catch (error) {
            logger.error(__filename, error.message, userData.name, domain, themeId, key);
            ctx.throw(error.status, error.message);
        }
    },
    saveFile: async (ctx) => {
        const { body, userData, shop } = ctx.request;
        const { domain, themeId, key, value, source_key, isDuplicate, appType } = body;

        try {
            const { token } = shop;
            let fileContent = value;

            // Validate app
            if (appType !== 'app_login') {
                throw createError(400, 'Private asset api');
            }

            // Check duplicate for layout
            if (isDuplicate) {
                // Check file exists
                const checkData = await ThemeService.findAllAsset({ domain, token, themeId, fields: 'key' });
                const checkIndex = checkData.assets.findIndex((item) => item.key === key);
                if (checkIndex > -1) {
                    throw createError(400, 'File is existed');
                }

                // Get content source file
                const sourceFile = await ThemeService.findSingleAsset({ domain, token, themeId, key: source_key });
                if (!sourceFile || !sourceFile.asset) {
                    throw createError(400, 'Not found source file');
                }
                fileContent = sourceFile.asset.value;
            }
            const data = await ThemeService.saveAsset({ domain, token, themeId, key, value: fileContent, source_key });
            if (data?.errors) {
                throw createError(400, data.errors.asset);
            }
            if (!data || !data.asset) {
                throw createError(404, 'Saving file 404');
            }

            ctx.body = {
                status: 'success',
                data: {
                    ...data.asset,
                    value: fileContent,
                },
            };
            logger.info(
                __filename,
                `Saved asset ${isDuplicate ? `copy ${source_key}` : 'success'}`,
                userData.name,
                domain,
                themeId,
                key
            );
        } catch (error) {
            logger.error(__filename, error.message, userData.name, domain, themeId, key);
            ctx.throw(error.status, error.message);
        }
    },
    removeFile: async (ctx) => {
        const { body, userData, shop } = ctx.request;
        const { domain, themeId, key, appType } = body;

        try {
            const { token } = shop;

            // Validate app
            if (appType !== 'app_login') {
                throw createError(400, 'Private asset api');
            }

            const data = await ThemeService.removeAsset({ domain, token, themeId, key });

            ctx.body = {
                status: 'success',
                data: data.message,
            };
            logger.info(__filename, 'Delete asset success', userData.name, domain, themeId, key);
        } catch (error) {
            logger.error(__filename, error.message, userData.name, domain, themeId, key);
            ctx.throw(error.status, error.message);
        }
    },
    renameFile: async (ctx) => {
        const { body, userData } = ctx.request;
        const { domain, themeId, key } = body;

        try {
            throw createError(400, 'Private asset');
            // const { token } = shop;
            // const data = await ThemeService.findSingleAsset({ domain, token, themeId, key });
            // if (!data || !data.asset) {
            //     throw createError(400, 'File not found');
            // }

            // const fileRename = await ThemeService.saveAsset({ domain, token, themeId, key: basename, source_key: key });
            // if (!fileRename || !fileRename.asset) {
            //     throw createError(400, 'Rename source key failed');
            // }

            // const fileDeleted = await ThemeService.removeAsset({ domain, token, themeId, key });
            // if (!fileDeleted || !fileDeleted.message) {
            //     throw createError(400, 'Delete file failed');
            // }

            // ctx.body = {
            //     status: 'success',
            //     message: 'Rename asset success',
            // };
            // logger.info(__filename, `New name ${basename} success`, userData.name, domain, themeId, key);
        } catch (error) {
            logger.error(__filename, error.message, userData.name, domain, themeId, key);
            ctx.throw(error.status, error.message);
        }
    },
    downloadTheme: async (ctx) => {
        const { userData, body, shop } = ctx.request;
        const { domain, themeId } = body;

        try {
            const { token } = shop;
            await publishRabbitMessage(DOWNLOAD_THEME_QUEUE, {
                domain,
                token,
                themeId,
                email: userData.email,
                user: userData.name,
            });

            ctx.body = {
                status: 'success',
            };
            logger.info(__filename, 'Trigger download theme success', userData.name, domain, themeId);
        } catch (error) {
            logger.error(__filename, error.message, userData.name, domain, themeId);
            ctx.throw(error.status, error.message);
        }
    },
};
