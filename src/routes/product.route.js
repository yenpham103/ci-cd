const Router = require('koa-router');
const productController = require('../controllers/product.controller');
const { verifyToken, verifyCachingShop } = require('../middleware/auth');

const productRouter = new Router({
    prefix: '/api/product',
});

productRouter.post('/get-all', verifyToken, verifyCachingShop, productController.getList);
productRouter.post('/get-by-id', verifyToken, verifyCachingShop, productController.getById);

module.exports = productRouter;
