const ratelimit = require('koa-ratelimit');

const db = new Map();
const limiter = (seconds, request = 1) => {
    return ratelimit({
        driver: 'memory',
        db: db,
        duration: seconds,
        max: request,
        id: (ctx) => {
            return ctx.ip;
        },
        headers: {
            remaining: 'Rate-Limit-Remaining',
            reset: 'Rate-Limit-Reset',
            total: 'Rate-Limit-Total',
        },
        errorMessage: JSON.stringify({
            success: false,
            message: 'Too Many Requests',
        }),
    });
};

module.exports = limiter;
