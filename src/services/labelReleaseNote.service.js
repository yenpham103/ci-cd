const models = require('../models')['label'].sequelize.models;

module.exports = {
    async getAll() {
        try {
            return await models.ReleaseNote.findAll({
                order: [['id', 'DESC']],
            });
        } catch (error) {
            throw new Error('Failed to fetch release notes');
        }
    },
    async getById(id) {
        try {
            return await models.ReleaseNote.findOne({
                where: { id },
            });
        } catch (error) {
            throw new Error('Failed to fetch release note by ID');
        }
    },
    async update(id, data) {
        try {
            return await models.ReleaseNote.update(data, { where: { id } });
        } catch (error) {
            throw new Error('Failed to update release note');
        }
    },
    async create(data) {
        try {
            return await models.ReleaseNote.create(data);
        } catch (error) {
            throw new Error('Failed to create release note');
        }
    },
    async delete(id) {
        try {
            return await models.ReleaseNote.destroy({ where: { id } });
        } catch (error) {
            throw new Error('Failed to delete release note');
        }
    },
};
