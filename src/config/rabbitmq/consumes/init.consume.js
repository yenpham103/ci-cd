const { DOWNLOAD_THEME_QUEUE } = require('../../../constants/rabbitmq.constant');
const { handleDownloadThemeConsume } = require('./theme.consume');

const initConsumeRabbitMQ = async (channel) => {
    await channel.assertQueue(DOWNLOAD_THEME_QUEUE, { durable: true });

    // Option process message from queue
    channel.prefetch(1);
    channel.consume(DOWNLOAD_THEME_QUEUE, (message) => handleDownloadThemeConsume(message, channel));
};

module.exports = { initConsumeRabbitMQ };
