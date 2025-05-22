const Router = require('koa-router');
const { verifyToken, verifyPermission, verifyCachingShop } = require('../middleware/auth');
const { getList, getById, getOrderEvents, getLineItems } = require('../controllers/order.controller');
const { APP_PERMISSION } = require('../constants/shop.constant');

const orderRouter = new Router({
    prefix: '/api/orders',
});

const allowAccess = [APP_PERMISSION.app_solution];

orderRouter.post('/list', verifyToken, verifyPermission(allowAccess), verifyCachingShop, getList);
orderRouter.post('/get-by-id', verifyToken, verifyPermission(allowAccess), verifyCachingShop, getById);
orderRouter.post('/get-events', verifyToken, verifyPermission(allowAccess), verifyCachingShop, getOrderEvents);
orderRouter.post('/get-line-items', verifyToken, verifyPermission(allowAccess), verifyCachingShop, getLineItems);

module.exports = orderRouter;
