const loginService = require('../services/login.service');
const logger = require('../log');

module.exports = {
    getSupportContentWithVersions: async (ctx) => {
        const { domain } = ctx.request.params;
        const { module, type, event } = ctx.request.query;
        try {
            const { supportVersions, currentSupport } = await loginService.getCurrentSupportContent(
                domain,
                module,
                type,
                event
            );

            ctx.body = {
                status: 'success',
                message: 'Get login support content successfully',
                currentSupport: currentSupport || '',
                versions: supportVersions || [],
            };

            logger.info(__filename, 'Get login support content successfully', '', domain);
        } catch (error) {
            logger.error(__filename, error.message, '', domain);
            ctx.throw(error.status, error.message);
        }
    },

    getVersionContent: async (ctx) => {
        const { id: versionId, domain } = ctx.request.params;
        try {
            const version = await loginService.getVersionById(domain, versionId);

            if (!version) throw new Error('Get login support version failed!');

            ctx.body = {
                status: 'success',
                message: 'Get login support version successfully',
                version: version,
            };
            logger.info(__filename, 'Get login support version successfully', '', domain);
        } catch (error) {
            logger.error(__filename, error.message, '', domain);
            ctx.throw(error.status, error.message);
        }
    },

    updateSupportContent: async (ctx) => {
        const { domain } = ctx.request.params;
        const { content, module, type, event } = ctx.request.body;
        const { email } = ctx.request.userData;
        try {
            if (!module || !type || !event) {
                throw new Error('Invalid module_code or content_type');
            }

            const body = {
                domain: domain,
                module: module,
                content_type: type,
                email: email,
                content: content,
                event: event,
            };
            const updateContent = await loginService.updateContent(body);

            if (!updateContent.success) {
                throw new Error(updateContent.message);
            }

            ctx.body = updateContent;
            logger.info(__filename, 'Update login support content successfully', '', domain);
        } catch (error) {
            logger.error(__filename, error.message, '', domain);
            ctx.throw(error.status || 400, error.message);
        }
    },
};
