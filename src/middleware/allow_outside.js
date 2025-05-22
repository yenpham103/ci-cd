const { ALLOW_URL_OUTSIDE } = require('../constants/outside.constant');

module.exports = {
    allowUrl: async (ctx, next) => {
        if (!ALLOW_URL_OUTSIDE.includes(ctx.request.header.origin)) {
            ctx.throw(403, 'Not access origin');
        }

        await next();
    },
};
