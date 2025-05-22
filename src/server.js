require('dotenv').config();
require('isomorphic-fetch');
const Koa = require('koa');
const parser = require('koa-bodyparser');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const router = require('./routes');
const { connectRabbitMQ } = require('./config/rabbitmq/rabbitmq.config');
const { sentrySendError, SentryInit } = require('./middleware/sentry.middleware');
const app = new Koa();
const PORT = process.env.PORT || 8000;
const { connectDBMida } = require('./config/database/mongo-db.config');
SentryInit();
//connect mongodb mida
connectDBMida(process.env.DB_MONGO_MIDA);
// Connect to rabbitMQ
connectRabbitMQ();
// Error handling
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = { status: 'error', message: err.status !== 500 ? err.message : 'Internal server error' };
        ctx.app.emit('error', err, ctx);
    }
});

app.use(helmet());
app.use(parser());
app.use(cors());

app.use(router());

app.on('error', sentrySendError);

app.listen(PORT, () => {
    console.log(`🚀 API SERVER is listening on port ${PORT} 🚀`);
});
