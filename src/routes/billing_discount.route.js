const Router = require('koa-router');
const labelBillingDiscount = require('../controllers/labelControllers/index.js').billingDiscount;
const locatorBillingDiscount = require('../controllers/locatorControllers/index.js').billingDiscount;
const { verifyToken, verifyPermission, verifyRole } = require('../middleware/auth.js');
const { APP_PERMISSION, ADMIN_ROLE, MANAGER_ROLE } = require('../constants/shop.constant.js');

const allowPermission = [APP_PERMISSION.app_label, APP_PERMISSION.app_locator];
const allowRole = [ADMIN_ROLE, MANAGER_ROLE];

const router = new Router({
    prefix: '/api/billing-discount',
});

const appLabelRouter = new Router({
    prefix: '/product-label',
});
const appLocatorRouter = new Router({
    prefix: '/store-locator',
});

appLabelRouter.use(verifyToken, verifyPermission(allowPermission), verifyRole(allowRole));
appLabelRouter.get('/get-all-discounts', labelBillingDiscount.getAllDiscounts);
appLabelRouter.post('/', labelBillingDiscount.createDiscountCode);
appLabelRouter.post('/:id', labelBillingDiscount.updateDiscountCode);
appLabelRouter.delete('/:id', labelBillingDiscount.deleteDiscountCode);

// locator
appLocatorRouter.use(verifyToken, verifyPermission(allowPermission), verifyRole(allowRole));
appLocatorRouter.get('/get-all-discounts', locatorBillingDiscount.getAllDiscounts);
appLocatorRouter.post('/', locatorBillingDiscount.createDiscountCode);
appLocatorRouter.post('/:id', locatorBillingDiscount.updateDiscountCode);
appLocatorRouter.delete('/:id', locatorBillingDiscount.deleteDiscountCode);

router.use(appLabelRouter.routes());
router.use(appLocatorRouter.routes());

module.exports = router;
