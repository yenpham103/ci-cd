const md5 = require('md5');
module.exports = async (ctx, next) => {
    try {
        const accessToken = ctx.request.headers['x-access-token'];
        if (!accessToken) {
            ctx.throw(401, 'No access token provided');
        }
        if (accessToken != md5(`${process.env.JENKINS_PASSWORD}`)) {
            ctx.throw(401, 'Stop right there, criminal!');
        }
    } catch (err) {
        ctx.status = 401;
        ctx.body = {
            status: 'error',
            message: 'Invalid access token',
        };
        return;
    }
    await next();
};
