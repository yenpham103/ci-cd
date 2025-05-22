const Router = require('koa-router');
const {
    getLabelLibs,
    createLabelLib,
    deleteLabelLib,
    updateLabelLib,
} = require('../controllers/library_label.controller');
const { verifyToken, verifyPermission, verifyRole } = require('../middleware/auth');
const { ADMIN_ROLE, MANAGER_ROLE, APP_PERMISSION } = require('../constants/shop.constant');

const allowPermission = [APP_PERMISSION.app_label];
const allowRole = [ADMIN_ROLE, MANAGER_ROLE];
const libraryLabelRouter = new Router({ prefix: '/api/label-library' });

libraryLabelRouter.use(verifyToken, verifyPermission(allowPermission), verifyRole(allowRole));
libraryLabelRouter.get('/', getLabelLibs);
libraryLabelRouter.post('/create', createLabelLib);
libraryLabelRouter.post('/:id', updateLabelLib);
libraryLabelRouter.post('/delete/:id', deleteLabelLib);

module.exports = libraryLabelRouter;
