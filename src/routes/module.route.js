const Router = require('koa-router');
const { verifyToken, verifyPermission } = require('../middleware/auth');
const { getList, create } = require('../controllers/module.controller');
const { APP_PERMISSION } = require('../constants/shop.constant');

const moduleRouter = new Router({
    prefix: '/api/modules',
});

const allowAccess = [APP_PERMISSION.access_endpoint];

moduleRouter.get('/', verifyToken, getList);
moduleRouter.post('/', verifyToken, verifyPermission(allowAccess), create);

module.exports = moduleRouter;
