const Router = require('koa-router');
const { getList, getById, create } = require('../controllers/version.controller');
const { verifyToken } = require('../middleware/auth');

const versionRouter = new Router({
    prefix: '/api/versions',
});

versionRouter.get('/:id', verifyToken, getById);
versionRouter.post('/all', verifyToken, getList);
versionRouter.post('/create', verifyToken, create);

module.exports = versionRouter;
