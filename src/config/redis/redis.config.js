const { createClient } = require('redis');
const logger = require('../../log');

const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.connect().then(() => {
    logger.info(__filename, 'Connecting to Redis OK');
});

redisClient.on('error', (e) => {
    logger.error(__filename, e.message);
});

redisClient.on('close', () => {
    logger.info(__filename, 'Connection to Redis closed');
});

module.exports = redisClient;
