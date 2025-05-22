const Router = require('koa-router');
const { verifyToken, verifyRole, verifyPermission } = require('../middleware/auth.js');
const CiCdController = require('../controllers/ci-cd.controller.js');
const { APP_PERMISSION } = require('../constants/shop.constant.js');
const jenkinsMiddleware = require('../middleware/jenkins.middleware.js');

const ciCdRoutes = new Router({
    prefix: '/api/ci-cd',
});

ciCdRoutes.get(
    '/getRepos',
    verifyToken,
    verifyRole(['admin', 'developer']),
    verifyPermission([APP_PERMISSION.config_ci_cd]),
    CiCdController.getRepos
);
ciCdRoutes.post(
    '/upsertRepo',
    verifyToken,
    verifyRole(['admin', 'developer']),
    verifyPermission([APP_PERMISSION.config_ci_cd]),
    CiCdController.upsertRepo
);
ciCdRoutes.post(
    '/deleteRepo',
    verifyToken,
    verifyRole(['admin', 'developer']),
    verifyPermission([APP_PERMISSION.config_ci_cd]),
    CiCdController.deleteRepo
);

ciCdRoutes.get(
    '/getServers',
    verifyToken,
    verifyRole(['admin', 'developer']),
    verifyPermission([APP_PERMISSION.config_ci_cd]),
    CiCdController.getServers
);
ciCdRoutes.post(
    '/upsertServer',
    verifyToken,
    verifyRole(['admin', 'developer']),
    verifyPermission([APP_PERMISSION.config_ci_cd]),
    CiCdController.upsertServer
);
ciCdRoutes.post(
    '/deleteServer',
    verifyToken,
    verifyRole(['admin', 'developer']),
    verifyPermission([APP_PERMISSION.config_ci_cd]),
    CiCdController.deleteServer
);

ciCdRoutes.post('/getAllConfigServerOp', jenkinsMiddleware, CiCdController.getAllConfigServerOp);

module.exports = ciCdRoutes;
