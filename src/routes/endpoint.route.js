const Router = require('koa-router');
const { verifyToken, verifyPermission } = require('../middleware/auth');
const {
    getList,
    create,
    getPublicList,
    getPrivateList,
    destroy,
    getById,
    update,
    getProtectList,
} = require('../controllers/endpoint.controller');
const { APP_PERMISSION } = require('../constants/shop.constant');

const endpointRouter = new Router({
    prefix: '/api/endpoints',
});

const allowAccess = [APP_PERMISSION.access_endpoint];

endpointRouter.get('/', verifyToken, getList);
endpointRouter.get('/public', getPublicList);
endpointRouter.get('/protect', getProtectList);
endpointRouter.get('/private', verifyToken, getPrivateList);
endpointRouter.get('/:id', verifyToken, getById);
endpointRouter.patch('/:id', verifyToken, verifyPermission(allowAccess), update);
endpointRouter.post('/', verifyToken, verifyPermission(allowAccess), create);
endpointRouter.delete('/:id', verifyToken, verifyPermission(allowAccess), destroy);

module.exports = endpointRouter;
