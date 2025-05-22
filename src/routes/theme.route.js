const Router = require('koa-router');
const {
    getList,
    getAssetList,
    getContentAsset,
    saveFile,
    removeFile,
    downloadTheme,
    renameFile,
} = require('../controllers/theme.controller');
const { verifyToken, verifyCachingShop } = require('../middleware/auth');

const themeRouter = new Router({
    prefix: '/api/themes',
});

themeRouter.post('/all', verifyToken, verifyCachingShop, getList);
themeRouter.post('/assets/all', verifyToken, verifyCachingShop, getAssetList);
themeRouter.post('/assets/content', verifyToken, verifyCachingShop, getContentAsset);
themeRouter.put('/assets', verifyToken, verifyCachingShop, saveFile);
themeRouter.post('/assets/delete', verifyToken, verifyCachingShop, removeFile);
themeRouter.post('/download', verifyToken, verifyCachingShop, downloadTheme);
themeRouter.post('/assets/rename', verifyToken, verifyCachingShop, renameFile);

module.exports = themeRouter;
