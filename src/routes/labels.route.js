const Router = require('koa-router');
const {
    getPrimaryImageByID,
    getLabelLibByID,
    bulkUpdate,
    bulkDelete,
    getLabelByID,
    deleteLabel,
} = require('../controllers/label.controller');
const { verifyToken, verifyPermission, verifyRole } = require('../middleware/auth');
const { ADMIN_ROLE, MANAGER_ROLE, APP_PERMISSION } = require('../constants/shop.constant');

const allowPermission = [APP_PERMISSION.app_label];
const allowRole = [ADMIN_ROLE, MANAGER_ROLE];
const labelRouter = new Router({ prefix: '/api/label' });

labelRouter.use(verifyToken, verifyPermission(allowPermission), verifyRole(allowRole));
labelRouter.get('/get-primary-image/:arrLibId', getPrimaryImageByID);
labelRouter.get('/:libId', getLabelLibByID);
labelRouter.post('/bulkUpdate', bulkUpdate);
labelRouter.post('/bulkDelete', bulkDelete);
labelRouter.post('/:id', getLabelByID);
labelRouter.post('/delete', deleteLabel);

module.exports = labelRouter;
