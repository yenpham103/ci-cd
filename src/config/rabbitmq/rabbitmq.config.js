const amqp = require('amqplib');
const url = process.env.RABBITMQ_URL || 'amqp://localhost';
const logger = require('../../log');
const { initConsumeRabbitMQ } = require('./consumes/init.consume');

const getRabbitChannel = async () => {
    try {
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel();

        return channel;
    } catch (error) {
        logger.error(__filename, error.message);
    }
};

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel();

        // Init consume
        await initConsumeRabbitMQ(channel);

        logger.info(__filename, 'Connecting to RabbitMQ OK');
        // Reconnect
        connection.on('error', function (err) {
            logger.error(__filename, err.message);
            setTimeout(connectRabbitMQ, 10000);
        });
        connection.on('close', function () {
            logger.error(__filename, 'connection to RabbitQM closed!');
            setTimeout(connectRabbitMQ, 10000);
        });
    } catch (error) {
        logger.error(__filename, error.message);
        setTimeout(connectRabbitMQ, 10000);
    }
};

module.exports = { connectRabbitMQ, getRabbitChannel };
