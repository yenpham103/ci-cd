const Router = require('koa-router');
const {
    getList,
    getInfo,
    getById,
    login,
    create,
    destroy,
    logout,
    block,
    update,
    restore,
    changePassword,
    bulkCreate,
    verifyEmail,
    verifyOtp,
    forgotPassword,
    getListCSE,
    loginWithGoogle,
} = require('../controllers/user.controller');
const { verifyToken, verifyRole } = require('../middleware/auth');
const limiter = require('../middleware/limiter');
const ONE_HOUR = 60 * 60 * 1000;
const userRouter = new Router({
    prefix: '/api/users',
});

userRouter.get('/', verifyToken, verifyRole(['admin', 'cse']), getList);
userRouter.get('/cse', verifyToken, getListCSE);
userRouter.get('/profile', verifyToken, getInfo);
userRouter.get('/:id', verifyToken, getById);
userRouter.post('/login', login);
userRouter.post('/google-oauth', loginWithGoogle);
userRouter.post('/change-password', verifyToken, changePassword);
userRouter.post('/logout', verifyToken, logout);
userRouter.post('/register', verifyToken, verifyRole(['admin']), create);
userRouter.post('/bulk-create', verifyToken, verifyRole(['admin']), bulkCreate);
userRouter.delete('/:id', verifyToken, verifyRole(['admin']), destroy);
userRouter.post('/block/:id', verifyToken, verifyRole(['admin']), block);
userRouter.patch('/:id', verifyToken, verifyRole(['admin']), update);
userRouter.post('/restore/:id', verifyToken, verifyRole(['admin']), restore);
userRouter.post('/verify-email', limiter(ONE_HOUR, 3), verifyEmail);
userRouter.post('/verify-otp', verifyOtp);
userRouter.post('/forgot-password', forgotPassword);

module.exports = userRouter;
