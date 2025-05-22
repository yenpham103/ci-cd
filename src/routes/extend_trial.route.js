const Router = require('koa-router');
const { updateExtendTrial } = require('../controllers/labelControllers/extend_trial.controller.js');
const { verifyToken, verifyPermission, verifyRole } = require('../middleware/auth.js');
const { ADMIN_ROLE, MANAGER_ROLE, APP_PERMISSION } = require('../constants/shop.constant');

const allowPermission = [APP_PERMISSION.app_label, APP_PERMISSION.app_locator];
const allowRole = [ADMIN_ROLE, MANAGER_ROLE];

const router = new Router({
    prefix: '/api/extend-trial',
});

const appLabelRouter = new Router({
    prefix: '/product-label',
});
const appLocatorRouter = new Router({
    prefix: '/store-locator',
});

appLabelRouter.use(verifyToken, verifyPermission(allowPermission), verifyRole(allowRole));
appLabelRouter.post('/submit', updateExtendTrial);

appLocatorRouter.use(verifyToken, verifyPermission(allowPermission), verifyRole(allowRole));
appLocatorRouter.post('/submit', updateExtendTrial);

router.use(appLabelRouter.routes());
router.use(appLocatorRouter.routes());

module.exports = router;
