const B2BService = require('../services/b2b.service');
const logger = require('../log');

module.exports = {
    getSupportContent: async (ctx) => {
        const { domain } = ctx.request.params;
        try {
            const supportContent = await B2BService.findByDomain(domain);
            if (supportContent) {
                ctx.body = {
                    status: 'success',
                    message: supportContent?.plain_text || '',
                };
                logger.info(__filename, 'Get b2b support content successfully', '', domain);
            }
        } catch (error) {
            logger.error(__filename, error.message, '', domain);
            ctx.throw(error.status, error.message);
        }
    },

    updateSupportContent: async (ctx) => {
        const { domain } = ctx.request.params;
        const { content } = ctx.request.body;
        try {
            const updateContent = await B2BService.updateContent(domain, content, ctx.request.userData.name);
            if (updateContent.success) {
                ctx.body = {
                    status: 'success',
                };
                logger.info(__filename, 'Update b2b support content successfully', '', domain);
            }
        } catch (error) {
            logger.error(__filename, error.message, '', domain);
            ctx.throw(error.status || 400, error.message);
        }
    },

    getVersionList: async (ctx) => {
        const { domain } = ctx.request.params;
        const { limit = 30 } = ctx.request.query;
        try {
            const versions = await B2BService.getVersionList(domain, parseInt(limit));
            if (versions) {
                ctx.body = {
                    status: 'success',
                    message: versions,
                };
                logger.info(__filename, 'Get b2b support version list successfully', '', domain);
            }
        } catch (error) {
            logger.error(__filename, error.message, '', domain);
            ctx.throw(error.status, error.message);
        }
    },

    getVersionContent: async (ctx) => {
        const { id, domain } = ctx.request.params;
        try {
            const version = await B2BService.getVersion(id, domain);
            if (version) {
                ctx.body = {
                    status: 'success',
                    message: version,
                };
                logger.info(__filename, 'Get b2b support version successfully', '', domain);
            }
        } catch (error) {
            logger.error(__filename, error.message, '', domain);
            ctx.throw(error.status, error.message);
        }
    },
};
