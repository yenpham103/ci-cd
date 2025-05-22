const Router = require('koa-router');
const taxController = require('../controllers/tax.controller');
const { verifyToken, verifyCachingShop } = require('../middleware/auth');

const taxRouter = new Router({
    prefix: '/api/taxes',
});

taxRouter.post('/get-all', verifyToken, verifyCachingShop, taxController.getList);
taxRouter.post('/get-by-id', verifyToken, verifyCachingShop, taxController.getById);

module.exports = taxRouter;
