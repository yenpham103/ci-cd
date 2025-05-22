const Router = require('koa-router');
const { verifyToken, verifyRole } = require('../middleware/auth');
const {
    getList,
    create,
    update,
    deleteById,
    updateReact,
    getById,
} = require('../controllers/support_issue.controller');

const supportIssueRouter = new Router({
    prefix: '/api/support-issue',
});

supportIssueRouter.get('/', verifyToken, getList);
supportIssueRouter.get('/:id', verifyToken, getById);
supportIssueRouter.post('/create', verifyToken, create);
supportIssueRouter.post('/react', verifyToken, updateReact);
supportIssueRouter.patch('/:id', verifyToken, update);
supportIssueRouter.delete('/:id', verifyToken, verifyRole(['admin']), deleteById);

module.exports = supportIssueRouter;
