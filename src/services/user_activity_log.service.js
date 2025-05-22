const User = require('../models')['support'].sequelize.models.users;
const UserActivityLog = require('../models')['support'].sequelize.models.user_activity_logs;
const logger = require('../log');

module.exports = {
    actionUpdate: async ({ user_id, creator }) => {
        try {
            const user = await User.findByPk(user_id);
            return await UserActivityLog.create({
                user_id: user.id,
                name: user.name,
                email: user.email,
                creator,
                action: 'update',
            });
        } catch (error) {
            logger.error(__filename, error.message, creator);
        }
    },
    actionDelete: async ({ user_id, creator }) => {
        try {
            const user = await User.findByPk(user_id, { paranoid: false });
            return await UserActivityLog.create({
                user_id: user.id,
                name: user.name,
                email: user.email,
                creator,
                action: 'delete',
            });
        } catch (error) {
            logger.error(__filename, error.message, creator);
        }
    },
};
