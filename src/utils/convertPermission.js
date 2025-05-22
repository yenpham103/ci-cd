const ShopConstant = require('../constants/shop.constant');

const convertPermissionsArrayToObject = (permissionsArray) => {
    const permissionsObject = {};

    permissionsArray &&
        Object.entries(ShopConstant.APP_PERMISSION).forEach(([permissionKey, permissionValue]) => {
            permissionsObject[permissionKey] = permissionsArray.includes(permissionValue) ? 1 : 0;
        });

    return permissionsObject;
};

const convertPermissionObjectToArray = (permissions) => {
    const permissionsArray = [];

    permissions &&
        Object.entries(ShopConstant.APP_PERMISSION).forEach(([permissionKey, permissionValue]) => {
            if (permissions[permissionKey] === 1) {
                permissionsArray.push(permissionValue);
            }
        });

    return permissionsArray;
};

const hasPermission = (user, permission) => {
    if (!user.permissions) return false;

    return user.permissions.includes(permission);
};

const hasPermissionWithType = (user, type) => {
    if (!user.permissions) return false;

    return user.permissions.includes(ShopConstant.APP_PERMISSION[type]);
};

module.exports = {
    convertPermissionsArrayToObject,
    convertPermissionObjectToArray,
    hasPermission,
    hasPermissionWithType,
};
