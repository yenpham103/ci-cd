const { Op } = require('sequelize');
const { EXPIRE_1_HOUR } = require('../constants/time.const');
const RedisService = require('./redis.service');
const { encodeStringToSHA256 } = require('./hash.service');

const User = require('../models')['support'].sequelize.models.users;
const Permission = require('../models')['support'].sequelize.models.permissions;
const ShopUserAccess = require('../models')['support'].sequelize.models.shop_user_accesses;

module.exports = {
    findAll: async ({ limit, offset = 0, name = '', email = '', role = '', deleted = false }) => {
        const where = {
            name: { [Op.like]: `%${name}%` },
            email: { [Op.like]: `%${email}%` },
            role: { [Op.like]: `%${role}%` },
        };

        if (deleted) {
            where.deletedAt = { [Op.not]: null };
        }

        return await User.findAndCountAll({
            limit,
            offset,
            where,
            paranoid: !deleted,
            attributes: { exclude: ['password', 'token'] },
        });
    },
    findById: async (id, options = {}, models = '') => {
        options.include = [{ model: Permission }];
        if (models.includes('shop')) {
            options.include = [...options.include, { model: ShopUserAccess, as: 'shopUserAccesses' }];
        }
        return await User.findByPk(id, { ...options });
    },
    findByEmail: async ({ email, models = [] }) => {
        let options = {};
        if (models.includes('permissions')) {
            options.include = [{ model: Permission }];
        }
        return await User.findOne({ where: { email }, ...options });
    },
    findByEmailOrNameWithDeleted: async ({ email = '', name = '', paranoid = false }) => {
        return await User.findOne({
            where: {
                [Op.or]: [{ email }, { name }],
            },
            paranoid,
        });
    },
    create: async ({ email, password, name, role }) => {
        return await User.create({ email, password, name, role });
    },
    update: async (filter, data) => {
        return await User.update(data, { where: filter });
    },
    delete: async (id) => {
        return await User.destroy({ where: { id } });
    },
    restore: async (id) => {
        return await User.restore({ where: { id } });
    },
    destroy: async (id) => {
        return await User.destroy({ where: { id }, force: true });
    },

    setOtpCache: async ({ userId, otp, expiration_time }) => {
        const valueRedis = JSON.stringify({
            otp,
            expiration_time,
        });
        await RedisService.set(`otp-${userId}`, valueRedis, {
            EX: EXPIRE_1_HOUR,
        });
    },

    getOtpCache: async ({ userId }) => {
        let otpCache = await RedisService.get(`otp-${userId}`);
        if (otpCache) {
            return JSON.parse(otpCache);
        }
        return null;
    },

    generateKeyPair: ({ user }) => {
        return encodeStringToSHA256(`${user.id}-${user.email}`);
    },

    getGoogleUserProfile: async (identityData) => {
        const url = await fetch(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${identityData.access_token}`,
            {
                headers: {
                    Authorization: `${identityData.token_type} ${identityData.access_token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        const data = await url.json();
        return data;
    },
};
