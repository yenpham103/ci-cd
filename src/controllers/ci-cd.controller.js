const CiCdService = require('../services/ci-cd.service.js');
const logger = require('../log');
const { ciCdServerSchema } = require('../validateSchema/ci-cd.schema.js');

module.exports = {
    getRepos: async (ctx) => {
        try {
            const repo = await CiCdService.getRepos();
            ctx.body = {
                status: 'success',
                data: repo,
            };
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
    upsertRepo: async (ctx) => {
        try {
            const body = ctx.request.body;
            const repo = await CiCdService.upsertRepo(body);
            ctx.body = {
                status: 'success',
                data: repo,
            };
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
    deleteRepo: async (ctx) => {
        try {
            const body = ctx.request.body;
            await CiCdService.deleteRepo(body.id);
            ctx.body = {
                status: 'success',
            };
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },

    getServers: async (ctx) => {
        try {
            const servers = await CiCdService.getServers();
            ctx.body = {
                status: 'success',
                data: servers,
            };
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
    upsertServer: async (ctx) => {
        try {
            await ciCdServerSchema.parseAsync(ctx.request.body);
            const body = ctx.request.body;
            const server = await CiCdService.upsertServer(body);
            ctx.body = {
                status: 'success',
                data: server,
            };
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
    deleteServer: async (ctx) => {
        try {
            const body = ctx.request.body;
            await CiCdService.deleteServer(body.id);
            ctx.body = {
                status: 'success',
            };
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },

    getAllConfigServerOp: async (ctx) => {
        try {
            const result = await CiCdService.getAllConfigServerOp();
            ctx.body = result;
            ctx.status = 200;
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
};
