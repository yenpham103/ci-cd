const BloopService = require('../services/bloop.service.js');
const logger = require('../log');

module.exports = {
    getSupportContent: async (ctx) => {
        const { params, userData } = ctx.request;
        const { domain } = params;
        const { name } = userData;
        try {
            const supportContent = await BloopService.findByDomain(domain);
            ctx.body = {
                status: 'success',
                message: supportContent?.content || '',
            };
            logger.info(__filename, 'Get bloop support content successfully', name, domain);
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
            await BloopService.updateContent(domain, content, name);
            ctx.body = {
                status: 'success',
            };
            logger.info(__filename, 'Update bloop support content successfully', name, domain);
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
            const versions = await BloopService.getVersionList(domain, parseInt(limit));
            ctx.body = {
                status: 'success',
                message: versions,
            };
            logger.info(__filename, 'Get bloop support version list successfully', name, domain);
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
            const version = await BloopService.getVersion(id, domain);
            ctx.body = {
                status: 'success',
                message: version,
            };
            logger.info(__filename, 'Get bloop support version successfully', name, domain);
        } catch (error) {
            logger.error(__filename, error.message, name, domain);
            ctx.throw(error.status, error.message);
        }
    },
};
