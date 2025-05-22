const Permission = require('../models')['support'].sequelize.models.permissions;

module.exports = {
    update: async ({ user_id, permissions }) => {
        return await Permission.update(permissions, { where: { user_id } });
    },
    create: async ({ user_id, permissions }) => {
        return await Permission.create({ ...permissions, user_id });
    },
    findByUserId: async ({ user_id }) => {
        return await Permission.findOne({ where: { user_id } });
    },
};
