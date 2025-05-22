const Router = require('koa-router');
const labelDiscountReport = require('../controllers/labelControllers/index.js').discountReport;
const locatorDiscountReport = require('../controllers/locatorControllers/index.js').discountReport;
const { verifyToken, verifyPermission, verifyRole } = require('../middleware/auth.js');
const { ADMIN_ROLE, MANAGER_ROLE, APP_PERMISSION } = require('../constants/shop.constant');

const allowPermission = [APP_PERMISSION.app_label, APP_PERMISSION.app_locator];
const allowRole = [ADMIN_ROLE, MANAGER_ROLE];

const router = new Router({
    prefix: '/api/discount-report',
});

const appLabelRouter = new Router({
    prefix: '/product-label',
});
const appLocatorRouter = new Router({
    prefix: '/store-locator',
});

appLabelRouter.use(verifyToken, verifyPermission(allowPermission), verifyRole(allowRole));
appLabelRouter.get('/get-all-discount-report', labelDiscountReport.getAllDiscountReports);

// locator
appLocatorRouter.use(verifyToken, verifyPermission(allowPermission), verifyRole(allowRole));
appLocatorRouter.get('/get-all-discount-report', locatorDiscountReport.getAllDiscountReports);

router.use(appLabelRouter.routes());
router.use(appLocatorRouter.routes());

module.exports = router;
