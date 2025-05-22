module.exports = {
    createError: (status, message) => {
        const error = new Error(message);
        error.status = status;
        return error;
    },
    clientError: (ctx, status, message) => {
        ctx.status = status || 500;
        ctx.body = {
            status: 'error',
            message: message || 'Internal server error',
        };
    },
};
