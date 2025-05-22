const Router = require('koa-router');
const { verifyToken, verifyPermission } = require('../middleware/auth');
const { getList, create, getByName } = require('../controllers/app.controller');
const { APP_PERMISSION } = require('../constants/shop.constant');

const appRouter = new Router({
    prefix: '/api/apps',
});

const allowAccess = [APP_PERMISSION.access_endpoint];

appRouter.get('/', verifyToken, getList);
appRouter.get('/:name', verifyToken, getByName);
appRouter.post('/', verifyToken, verifyPermission(allowAccess), create);

module.exports = appRouter;
