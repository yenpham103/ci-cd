const redisClient = require(`../config/redis/redis.config`);

class RedisService {
    static async set(key, value, options = {}) {
        return await redisClient.set(key, value, options);
    }

    static async get(key) {
        return await redisClient.get(key);
    }
}

module.exports = RedisService;
