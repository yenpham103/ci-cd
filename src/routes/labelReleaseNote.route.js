const Router = require('koa-router');
const { verifyToken, verifyRole, verifyPermission } = require('../middleware/auth');
const { APP_PERMISSION, MANAGER_ROLE, ADMIN_ROLE } = require('../constants/shop.constant');
const allowAccess = [APP_PERMISSION.app_label];
const allowRole = [ADMIN_ROLE, MANAGER_ROLE];

const labelReleaseNoteRouter = new Router({ prefix: '/api/label-release-notes' });
const labelReleaseNoteController = require('../controllers/labelReleaseNote.controller');

labelReleaseNoteRouter.get('/', (ctx) => labelReleaseNoteController.getAll(ctx));
labelReleaseNoteRouter.get('/:id', (ctx) => labelReleaseNoteController.getById(ctx));
labelReleaseNoteRouter.put('/:id', verifyToken, verifyRole(allowRole), verifyPermission(allowAccess), (ctx) =>
    labelReleaseNoteController.update(ctx)
);
labelReleaseNoteRouter.post('/', verifyToken, verifyRole(allowRole), verifyPermission(allowAccess), (ctx) =>
    labelReleaseNoteController.create(ctx)
);
labelReleaseNoteRouter.delete('/:id', verifyToken, verifyRole(allowRole), verifyPermission(allowAccess), (ctx) =>
    labelReleaseNoteController.delete(ctx)
);

module.exports = labelReleaseNoteRouter;
