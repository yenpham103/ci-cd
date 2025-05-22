const Router = require('koa-router');
const { verifyToken } = require('../middleware/auth');
const { allowUrl } = require('../middleware/allow_outside');
const { getList, create } = require('../controllers/session.controller');

const sessionRouter = new Router({
    prefix: '/api/sessions',
});

sessionRouter.get('/', verifyToken, getList);
sessionRouter.post('/create', allowUrl, create);

module.exports = sessionRouter;
