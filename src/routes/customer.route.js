const Router = require('koa-router');
const customerController = require('../controllers/customer.controller');
const { verifyToken, verifyCachingShop } = require('../middleware/auth');

const customerRouter = new Router({
    prefix: '/api/customer',
});

customerRouter.post('/get-all', verifyToken, verifyCachingShop, customerController.getList);
customerRouter.post('/get-by-id', verifyToken, verifyCachingShop, customerController.getById);

module.exports = customerRouter;
