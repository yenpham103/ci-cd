const Router = require('koa-router');
const {
    getAllReviewedCustomers,
    getDataShopByDomain,
    addDomains,
    deleteDomain,
} = require('../controllers/reviewed_customer.controller');
const { verifyToken, verifyPermission, verifyRole } = require('../middleware/auth');
const { ADMIN_ROLE, MANAGER_ROLE, APP_PERMISSION, CSE_ROLE } = require('../constants/shop.constant');

const allowPermission = [APP_PERMISSION.app_label];
const allowRole = [ADMIN_ROLE, MANAGER_ROLE, CSE_ROLE];
const reviewedCustomerRouter = new Router({ prefix: '/api/reviewed-customer' });

reviewedCustomerRouter.use(verifyToken, verifyPermission(allowPermission), verifyRole(allowRole));
reviewedCustomerRouter.get('/', getAllReviewedCustomers);
reviewedCustomerRouter.post('/search', getDataShopByDomain);
reviewedCustomerRouter.post('/add-domain', addDomains);
reviewedCustomerRouter.post('/delete-domain', deleteDomain);

module.exports = reviewedCustomerRouter;
