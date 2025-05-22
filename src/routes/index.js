const combineRouters = require('koa-combine-routers');
const userRouter = require('./user.route');
const shopRouter = require('./shop.route');
const themeRouter = require('./theme.route');
const versionRouter = require('./version.route');
const shopUserAccessRouter = require('./shop_user_access.route');
const appRouter = require('./app.route');
const moduleRouter = require('./module.route');
const endpointRouter = require('./endpoint.route');
const sessionRouter = require('./session.route');
const orderRouter = require('./order.route');
const taxRouter = require('./tax.route');
const supportRouter = require('./support.route');
const locatorRouter = require('./extend_store_limit.route');
const productRouter = require('./product.route');
const customerRouter = require('./customer.route');
const supportIssuesRouter = require('./support_issue.route');
const labelReleaseNoteRouter = require('./labelReleaseNote.route');
const billingDiscountRouter = require('./billing_discount.route');
const discountReportRouter = require('./discount_report.route');
const partnerAppRouter = require('./partner_app.route');
const customerLabelRouter = require('./customerLabel.route');
const reviewedCustomerRouter = require('./reviewed_customer.route');
const libraryLabelRouter = require('./library_label.route');
const labelsRouter = require('./labels.route');
const extendTrialRouter = require('./extend_trial.route');
const ciCdRouter = require('./ci-cd.route');
const imageLibraryRouter = require('./image_library.route');

const router = combineRouters(
    userRouter,
    shopRouter,
    themeRouter,
    versionRouter,
    shopUserAccessRouter,
    appRouter,
    moduleRouter,
    endpointRouter,
    sessionRouter,
    orderRouter,
    taxRouter,
    supportRouter,
    locatorRouter,
    productRouter,
    customerRouter,
    supportIssuesRouter,
    labelReleaseNoteRouter,
    partnerAppRouter,
    reviewedCustomerRouter,
    libraryLabelRouter,
    labelsRouter,
    billingDiscountRouter,
    discountReportRouter,
    customerLabelRouter,
    extendTrialRouter,
    ciCdRouter,
    imageLibraryRouter
);

module.exports = router;
