const logger = require('../log');
const bannerService = require('../services/banner.service.js');
const { IncomingForm } = require('formidable');

module.exports = {
    transferDataFromAppLabel: async (ctx) => {
        const { domain } = ctx.request.body;
        try {
            if (!domain) {
                throw Error('Domain is required');
            }
            const data = await bannerService.transferDataFromLabel(domain);
            return (ctx.body = {
                success: true,
                data: data,
            });
        } catch (error) {
            logger.error(__filename, error.message, '', domain);
            ctx.throw(error.status, error.message);
        }
    },
    removeWatermarkApp: async (ctx) => {
        const { domain } = ctx.request.body;
        try {
            if (!domain) {
                throw Error('Domain is required');
            }
            const data = await bannerService.removeWatermark(domain);
            return (ctx.body = {
                success: true,
                data: data,
            });
        } catch (error) {
            logger.error(__filename, error.message, '', domain);
            ctx.throw(error.status, error.message);
        }
    },
    getSupportContent: async (ctx) => {
        const { params, userData } = ctx.request;
        const { domain } = params;
        const { name } = userData;
        try {
            const supportContent = await bannerService.findByDomain(domain);
            ctx.body = {
                status: 'success',
                message: supportContent?.content || '',
            };
            logger.info(__filename, 'Get banner support content successfully', name, domain);
        } catch (error) {
            logger.error(__filename, error.message, name, domain);
            ctx.throw(error.status, error.message);
        }
    },
    updateSupportContent: async (ctx) => {
        const { params, body, userData } = ctx.request;
        const { domain } = params;
        const { content } = body;
        const { name } = userData;
        try {
            await bannerService.updateContent(domain, content, name);
            ctx.body = {
                status: 'success',
            };
            logger.info(__filename, 'Update banner support content successfully', name, domain);
        } catch (error) {
            logger.error(__filename, error.message, name, domain);
            ctx.throw(error.status || 400, error.message);
        }
    },
    getVersionList: async (ctx) => {
        const { params, query, userData } = ctx.request;
        const { domain } = params;
        const { limit = 8 } = query;
        const { name } = userData;
        try {
            const versions = await bannerService.getVersionList(domain, parseInt(limit));
            ctx.body = {
                status: 'success',
                message: versions,
            };
            logger.info(__filename, 'Get banner support version list successfully', name, domain);
        } catch (error) {
            logger.error(__filename, error.message, name, domain);
            ctx.throw(error.status, error.message);
        }
    },
    getVersionContent: async (ctx) => {
        const { params, userData } = ctx.request;
        const { id, domain } = params;
        const { name } = userData;
        try {
            const version = await bannerService.getVersion(id, domain);
            ctx.body = {
                status: 'success',
                message: version,
            };
            logger.info(__filename, 'Get banner support version successfully', name, domain);
        } catch (error) {
            logger.error(__filename, error.message, name, domain);
            ctx.throw(error.status, error.message);
        }
    },
    enableTranslateFeature: async (ctx) => {
        const { domain } = ctx.request.body;
        try {
            if (!domain) {
                throw Error('Domain is required');
            }
            const data = await bannerService.enableTranslateFeature(domain);
            return (ctx.body = {
                success: true,
                data: data,
            });
        } catch (error) {
            logger.error(__filename, error.message, '', domain);
            ctx.throw(error.status, error.message);
        }
    },
    getPartnerApps: async (ctx) => {
        try {
            const data = await bannerService.getPartnerApps();
            return (ctx.body = {
                success: true,
                data: data.data,
            });
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
    createPartnerApp: async (ctx) => {
        try {
            const partner = await bannerService.createPartnerApp(ctx.request.body);
            return (ctx.body = {
                success: true,
                data: partner,
            });
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
    updatePartnerApp: async (ctx) => {
        try {
            const partnerId = ctx.params.id;
            const partner = await bannerService.updatePartnerApp(partnerId, ctx.request.body);
            return (ctx.body = {
                success: true,
                data: partner,
            });
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
    deletePartnerApp: async (ctx) => {
        try {
            const partnerId = ctx.params.id;
            const response = await bannerService.deletePartnerApp(partnerId);
            return (ctx.body = {
                success: response.success,
            });
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },

    // ------------------ image library ---------------
    getImageLibrary: async (ctx) => {
        try {
            const { ruleType } = ctx.query;
            const items = await bannerService.getImageLibrary(ruleType);
            ctx.body = {
                success: true,
                libraries: items,
            };
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
    createImageLibrary: async (ctx) => {
        try {
            const { ruleType } = ctx.query;
            const res = await bannerService.createImageLibrary(ruleType, ctx.request.body);
            ctx.body = {
                status: true,
                data: res,
            };
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },

    updateImageLibrary: async (ctx) => {
        try {
            const res = await bannerService.updateImageLibrary(ctx.params.id, ctx.request.body);
            ctx.body = {
                status: true,
                data: res,
            };
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
    deleteImageLibrary: async (ctx) => {
        try {
            const responseData = await bannerService.deleteImageLibrary(ctx.params.id);
            ctx.body = {
                status: responseData.success,
                message: responseData.message,
            };
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },

    // --- manage image in library
    getImagesByLibId: async (ctx) => {
        try {
            const { libraryId } = ctx.query;
            const data = await bannerService.getImagesByLibId(libraryId);
            ctx.body = {
                success: true,
                images: data.data,
            };
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
    uploadImage: async (ctx) => {
        try {
            const form = new IncomingForm();
            const libraryId = ctx.params.libraryId;

            await new Promise((resolve, reject) => {
                form.parse(ctx.req, async (err, fields, files) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    const responseData = await bannerService.uploadImage(libraryId, files.filetoupload[0]);

                    if (!responseData.success) reject();

                    ctx.body = {
                        status: true,
                        message: 'File received',
                        public_url: responseData.data,
                    };

                    resolve();
                });
            });
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status || 500, error.message);
        }
    },
    bulkUpdate: async (ctx) => {
        try {
            await bannerService.bulkUpdate(ctx.request.body);
            ctx.body = { success: true };
        } catch (error) {
            ctx.status = 500;
            ctx.body = { success: false, message: error.message || 'Internal Server Error' };
        }
    },
    // Xóa các images:  { lib_id: '1', idImages: [ 2, 1 ] }
    bulkDelete: async (ctx) => {
        try {
            await bannerService.bulkDelete(ctx.request.body);
            ctx.body = { success: true };
        } catch (error) {
            ctx.status = 500;
            ctx.body = { success: false, message: error.message || 'Internal Server Error' };
        }
    },
};
