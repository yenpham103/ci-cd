const Router = require('koa-router');
const customerLabelController = require('../controllers/customerLabel.controller');
const { verifyToken, verifyPermission, verifyRole } = require('../middleware/auth');
const { ADMIN_ROLE, MANAGER_ROLE, APP_PERMISSION } = require('../constants/shop.constant');

const allowPermission = [APP_PERMISSION.app_label];
const allowRole = [ADMIN_ROLE, MANAGER_ROLE];

const customerLabelRouter = new Router({ prefix: '/api/customer-label' });
customerLabelRouter.use(verifyToken, verifyPermission(allowPermission), verifyRole(allowRole));

customerLabelRouter.get('/', customerLabelController.getCustomerLabel);
// eslint-disable-next-line
customerLabelRouter.post('/copy-to-lib', customerLabelController.copyToLib);

module.exports = customerLabelRouter;
