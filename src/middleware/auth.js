const jwt = require('jsonwebtoken');
const UserService = require('../services/user.service');
const { convertPermissionObjectToArray, hasPermissionWithType } = require('../utils/convertPermission');
const shopService = require('../services/shop.service');
const { APP_PERMISSION, EXPIRE_1_DAY, ADMIN_ROLE, CSE_ROLE } = require('../constants/shop.constant');
const ShopUserAccessService = require('../services/shop_user_access.service');
const { createError } = require('../utils/error');

module.exports = {
    verifyToken: async (ctx, next) => {
        try {
            const authorization = ctx.request.headers.authorization;
            const token = authorization.replace('Bearer ', '');
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            const user = await UserService.findById(decoded.userId);
            if (!user || user.token !== token) {
                ctx.throw(401, 'User use other token');
            }

            ctx.request.userData = {
                id: decoded.userId,
                name: user.name,
                role: user.role,
                email: user?.email,
                permissions: convertPermissionObjectToArray(user.permission),
            };
        } catch (err) {
            ctx.status = 401;
            ctx.body = {
                status: 'error',
                message: 'Invalid access token',
            };
            return;
        }
        await next();
    },
    verifyRole: (roles) => {
        return async (ctx, next) => {
            if (!roles.includes(ctx.request.userData.role)) {
                ctx.throw(403, 'Do not have access');
            }

            await next();
        };
    },
    verifyPermission: (permissions) => {
        return async (ctx, next) => {
            const userPermissions = new Set(ctx.request.userData.permissions);

            if (!permissions.some((permission) => userPermissions.has(permission))) {
                ctx.throw(403, 'Do not have access');
            }

            await next();
        };
    },
    verifyShop: async (ctx, next) => {
        const { domain, token } = ctx.request.body;

        if (!domain || !token) {
            ctx.throw(400, 'Invalid domain or token');
        }

        return next();
    },
    verifyCachingShop: async (ctx, next) => {
        const { query, userData, body, params } = ctx.request;

        const domain = query.domain || body.domain || params.domain;
        const appType = query.appType || body.appType;
        const status = query.status ? query.status : 1;
        if (!domain || !appType) {
            ctx.throw(400, 'Invalid domain or type');
        }

        if (!Object.keys(APP_PERMISSION).includes(appType)) {
            ctx.throw(400, `Invalid app type '${appType}'`);
        }

        if (userData.role !== ADMIN_ROLE && userData.role !== CSE_ROLE) {
            if (!hasPermissionWithType(userData, appType)) {
                throw createError(403, 'Not permissions');
            }

            const allowDomain = await ShopUserAccessService.findByUserAndDomain({
                user_id: userData.id,
                domain,
                options: { raw: true },
            });
            if (!allowDomain) {
                ctx.throw(400, `You don't have access to domain ${domain}`);
            }
        }

        const shopCache = await shopService.getShopCache({ domain, appType });
        if (shopCache) {
            ctx.request.shop = shopCache;
            return await next();
        }

        let options = {
            attributes: ['token'],
        };

        const shops = await shopService.findAll(
            {
                type: appType,
                domain,
                limit: 1,
                offset: 0,
                status: status,
            },
            options
        );

        if (!shops || !shops.count) {
            ctx.throw(404, `Could not found shop by domain ${domain}`);
        }

        await shopService.setShopCache({ domain, appType, shop: shops.rows[0], options: { EX: EXPIRE_1_DAY } });
        ctx.request.shop = shops.rows[0];

        return await next();
    },
};
