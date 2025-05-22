const Router = require('koa-router');
const { verifyToken } = require('../middleware/auth');
const { getList, getTaxConfig } = require('../controllers/shop.controller');

const shopRouter = new Router({
    prefix: '/api/shops',
});

shopRouter.get('/', verifyToken, getList);
shopRouter.post('/get-tax-config', verifyToken, getTaxConfig);

module.exports = shopRouter;
