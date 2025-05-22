const Router = require('koa-router');
const { verifyToken, verifyRole, verifyPermission } = require('../middleware/auth');
const { PERMISSION, ADMIN_ROLE, MANAGER_ROLE, CSE_ROLE } = require('../constants/app.constant');
const extendStoreController = require('../controllers/locatorControllers').extendStore;
const allowAccessPermission = [PERMISSION.app_locator];
const allowAccessRole = [ADMIN_ROLE, CSE_ROLE, MANAGER_ROLE];

const extendStoreRouter = new Router({ prefix: '/api/extend-store' });

extendStoreRouter.get(
    '/check-shop-info/:domain',
    verifyToken,
    verifyRole(allowAccessRole),
    verifyPermission(allowAccessPermission),
    (ctx) => extendStoreController.checkShopInfo(ctx)
);
extendStoreRouter.put(
    '/extend-store-limit/:domain',
    verifyToken,
    verifyRole(allowAccessRole),
    verifyPermission(allowAccessPermission),
    (ctx) => extendStoreController.extendStoreLimit(ctx)
);

module.exports = extendStoreRouter;
