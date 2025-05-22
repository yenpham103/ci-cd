const Router = require('koa-router');
const appLabelController = require('../controllers/labelControllers').support;
const appB2bController = require('../controllers/b2b.controller');
const appPortalController = require('../controllers/portal.controller');
const appLocatorController = require('../controllers/locatorControllers').support;
const appOptionController = require('../controllers/option.controller.js');
const appBloopController = require('../controllers/bloop.controller.js');
const appLoginController = require('../controllers/login.controller.js');
const appBannerController = require('../controllers/banner.controller.js');
const { verifyToken, verifyCachingShop } = require('../middleware/auth');

const router = new Router({
    prefix: '/api/support',
});

const appLabelRouter = new Router({
    prefix: '/app_label',
});

const appB2bRouter = new Router({
    prefix: '/app_solution',
});

const appPortalRouter = new Router({
    prefix: '/app_portal',
});

const appLocatorRouter = new Router({
    prefix: '/app_locator',
});

const appBloopRouter = new Router({
    prefix: '/app_bloop',
});

const appOptionRouter = new Router({
    prefix: '/app_option',
});

const appLoginRouter = new Router({
    prefix: '/app_login',
});

const appBannerRouter = new Router({
    prefix: '/app_banner',
});

appLabelRouter.get('/:domain', verifyToken, appLabelController.getSupportContent);
appLabelRouter.get('/:domain/versions', verifyToken, appLabelController.getVersionList);
appLabelRouter.get('/:domain/versions/:id', verifyToken, appLabelController.getVersionContent);
appLabelRouter.post('/:domain', verifyToken, verifyCachingShop, appLabelController.updateSupportContent);

appB2bRouter.get('/:domain', verifyToken, appB2bController.getSupportContent);
appB2bRouter.get('/:domain/versions', verifyToken, appB2bController.getVersionList);
appB2bRouter.get('/:domain/versions/:id', verifyToken, appB2bController.getVersionContent);
appB2bRouter.post('/:domain', verifyToken, verifyCachingShop, appB2bController.updateSupportContent);

appPortalRouter.get('/:domain', verifyToken, appPortalController.getSupportContent);
appPortalRouter.get('/:domain/versions', verifyToken, appPortalController.getVersionList);
appPortalRouter.get('/:domain/versions/:id', verifyToken, appPortalController.getVersionContent);
appPortalRouter.post('/:domain', verifyToken, verifyCachingShop, appPortalController.updateSupportContent);

appLocatorRouter.get('/:domain', verifyToken, appLocatorController.getSupportContent);
appLocatorRouter.get('/:domain/versions', verifyToken, appLocatorController.getVersionList);
appLocatorRouter.get('/:domain/versions/:id', verifyToken, appLocatorController.getVersionContent);
appLocatorRouter.post('/:domain', verifyToken, verifyCachingShop, appLocatorController.updateSupportContent);

appBloopRouter.get('/:domain', verifyToken, appBloopController.getSupportContent);
appBloopRouter.get('/:domain/versions', verifyToken, appBloopController.getVersionList);
appBloopRouter.get('/:domain/versions/:id', verifyToken, appBloopController.getVersionContent);
appBloopRouter.post('/:domain', verifyToken, verifyCachingShop, appBloopController.updateSupportContent);

appOptionRouter.get('/:domain', verifyToken, appOptionController.getSupportContent);
appOptionRouter.get('/:domain/versions', verifyToken, appOptionController.getVersionList);
appOptionRouter.get('/:domain/versions/:id', verifyToken, appOptionController.getVersionContent);
appOptionRouter.post('/:domain', verifyToken, verifyCachingShop, appOptionController.updateSupportContent);

appLoginRouter.get('/:domain', verifyToken, appLoginController.getSupportContentWithVersions);
appLoginRouter.get('/:domain/versions/:id', verifyToken, appLoginController.getVersionContent);
appLoginRouter.post('/:domain', verifyToken, verifyCachingShop, appLoginController.updateSupportContent);

appBannerRouter.post('/transferData', verifyToken, appBannerController.transferDataFromAppLabel);
appBannerRouter.post('/removeWatermark', verifyToken, appBannerController.removeWatermarkApp);
appBannerRouter.post('/enableTranslateFeature', verifyToken, appBannerController.enableTranslateFeature);
appBannerRouter.get('/:domain', verifyToken, appBannerController.getSupportContent);
appBannerRouter.get('/:domain/versions', verifyToken, appBannerController.getVersionList);
appBannerRouter.get('/:domain/versions/:id', verifyToken, appBannerController.getVersionContent);
appBannerRouter.post('/:domain', verifyToken, verifyCachingShop, appBannerController.updateSupportContent);

router.use(appLabelRouter.routes());
router.use(appB2bRouter.routes());
router.use(appPortalRouter.routes());
router.use(appLocatorRouter.routes());
router.use(appBloopRouter.routes());
router.use(appOptionRouter.routes());
router.use(appLoginRouter.routes());
router.use(appBannerRouter.routes());

module.exports = router;
