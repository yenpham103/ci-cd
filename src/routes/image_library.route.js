const Router = require('koa-router');
const bannerController = require('../controllers/banner.controller');
const { verifyToken, verifyRole, verifyPermission } = require('../middleware/auth');

const { PERMISSION, ADMIN_ROLE, MANAGER_ROLE, CSE_ROLE } = require('../constants/app.constant');

const allowAccessPermission = [PERMISSION.app_banner, PERMISSION.app_locator];
const allowAccessRole = [ADMIN_ROLE, CSE_ROLE, MANAGER_ROLE];

const route = new Router({
    prefix: '/api/image-library',
});

const bannerRouter = new Router({
    prefix: '/sale-banner-popup',
});

// banner
bannerRouter.get('/', verifyToken, bannerController.getImageLibrary);
bannerRouter.post(
    '/create',
    verifyToken,
    verifyPermission(allowAccessPermission),
    verifyRole(allowAccessRole),
    bannerController.createImageLibrary
);
bannerRouter.post(
    '/update/:id?',
    verifyToken,
    verifyPermission(allowAccessPermission),
    verifyRole(allowAccessRole),
    bannerController.updateImageLibrary
);
bannerRouter.delete(
    '/delete/:id',
    verifyToken,
    verifyPermission(allowAccessPermission),
    verifyRole(allowAccessRole),
    bannerController.deleteImageLibrary
);
// manage image
bannerRouter.get('/images-in-library', verifyToken, bannerController.getImagesByLibId);
bannerRouter.post(
    '/uploadImageLib/:libraryId',
    verifyToken,
    verifyPermission(allowAccessPermission),
    verifyRole(allowAccessRole),
    bannerController.uploadImage
);
bannerRouter.post(
    '/bulkDelete',
    verifyToken,
    verifyPermission(allowAccessPermission),
    verifyRole(allowAccessRole),
    bannerController.bulkDelete
);
bannerRouter.post(
    '/bulkUpdate',
    verifyToken,
    verifyPermission(allowAccessPermission),
    verifyRole(allowAccessRole),
    bannerController.bulkUpdate
);

route.use(bannerRouter.routes());

module.exports = route;
