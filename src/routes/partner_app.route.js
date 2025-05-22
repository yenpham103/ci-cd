const Router = require('koa-router');
const locatorController = require('../controllers/locatorControllers').partnerApp;
const bannerController = require('../controllers/banner.controller');
const labelController = require('../controllers/labelControllers').partnerApp;
const { verifyToken, verifyRole, verifyPermission } = require('../middleware/auth');

const { PERMISSION, ADMIN_ROLE, MANAGER_ROLE, CSE_ROLE } = require('../constants/app.constant');

const allowAccessPermission = [PERMISSION.app_banner, PERMISSION.app_locator];
const allowAccessRole = [ADMIN_ROLE, CSE_ROLE, MANAGER_ROLE];

const route = new Router({
    prefix: '/api/partner-app',
});

const labelRouter = new Router({
    prefix: '/product-label',
});
const locatorRouter = new Router({
    prefix: '/store-locator',
});
const bannerRouter = new Router({
    prefix: '/sale-banner-popup',
});

// label
labelRouter.use(verifyToken, verifyPermission(allowAccessPermission), verifyRole(allowAccessRole));
labelRouter.get('/', labelController.getPartnerApps);
labelRouter.post('/create', labelController.createPartnerApp);
labelRouter.post('/update/:id?', labelController.updatePartnerApp);
labelRouter.delete('/delete/:id', labelController.deletePartnerApp);

// locator
locatorRouter.use(verifyToken, verifyPermission(allowAccessPermission), verifyRole(allowAccessRole));
locatorRouter.get('/', locatorController.getPartnerApps);
locatorRouter.post('/create', locatorController.createPartnerApp);
locatorRouter.post('/update/:id?', locatorController.updatePartnerApp);
locatorRouter.delete('/delete/:id', locatorController.deletePartnerApp);

// banner
bannerRouter.get('/', verifyToken, bannerController.getPartnerApps);
bannerRouter.post(
    '/create',
    verifyToken,
    verifyPermission(allowAccessPermission),
    verifyRole(allowAccessRole),
    bannerController.createPartnerApp
);
bannerRouter.post(
    '/update/:id?',
    verifyToken,
    verifyPermission(allowAccessPermission),
    verifyRole(allowAccessRole),
    bannerController.updatePartnerApp
);
bannerRouter.delete(
    '/delete/:id',
    verifyToken,
    verifyPermission(allowAccessPermission),
    verifyRole(allowAccessRole),
    bannerController.deletePartnerApp
);

route.use(labelRouter.routes());
route.use(locatorRouter.routes());
route.use(bannerRouter.routes());

module.exports = route;
