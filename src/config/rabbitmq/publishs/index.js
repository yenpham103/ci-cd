const { getRabbitChannel } = require('../rabbitmq.config');

const publishRabbitMessage = async (queue, message) => {
    const channel = await getRabbitChannel();

    await channel.assertQueue(queue, { durable: true });

    const messageBuffer = Buffer.from(JSON.stringify(message));
    channel.sendToQueue(queue, messageBuffer, { persistent: true });
};

module.exports = { publishRabbitMessage };
