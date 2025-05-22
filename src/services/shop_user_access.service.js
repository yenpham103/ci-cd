const User = require('../models')['support'].sequelize.models.users;
const ShopUserAccess = require('../models')['support'].sequelize.models.shop_user_accesses;

module.exports = {
    insertOne: async ({ user_id, domain, assigner_id }) => {
        return await ShopUserAccess.create({ user_id, domain, assigner_id });
    },
    deleteOne: async (id) => {
        return await ShopUserAccess.destroy({ where: { id } });
    },
    findAll: async ({ user_id, options = {} }) => {
        return await ShopUserAccess.findAll({
            where: { user_id },
            include: [
                {
                    model: User,
                    as: 'assigner',
                    attributes: ['id', 'name'],
                },
            ],
            order: [['id', 'DESC']],
            ...options,
        });
    },
    findByUserAndDomain: async ({ user_id, domain, options = {} }) => {
        return await ShopUserAccess.findOne({
            where: {
                user_id,
                domain,
            },
            include: [
                {
                    model: User,
                    as: 'assigner',
                    attributes: ['id', 'name'],
                },
            ],
            order: [['id', 'DESC']],
            ...options,
        });
    },
};
