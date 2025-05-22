const Router = require('koa-router');
const { verifyToken, verifyPermission } = require('../middleware/auth');
const { getListByUser, insertOneDomain, deleteById } = require('../controllers/shop_user_access.controller');
const { APP_PERMISSION } = require('../constants/shop.constant');
const allowAccess = [APP_PERMISSION.shop_user_access];

const shopUserAccessRouter = new Router({
    prefix: '/api/shop-user-accesses',
});

shopUserAccessRouter.get('/', verifyToken, getListByUser);
shopUserAccessRouter.post('/', verifyToken, verifyPermission(allowAccess), insertOneDomain);
shopUserAccessRouter.delete('/:id', verifyToken, verifyPermission(allowAccess), deleteById);

module.exports = shopUserAccessRouter;
