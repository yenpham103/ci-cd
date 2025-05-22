const CiCdRepo = require('../models')['support'].sequelize.models.ci_cd_repos;
const CiCdServer = require('../models')['support'].sequelize.models.ci_cd_servers;

module.exports = {
    getRepos: async (filter = {}) => {
        return CiCdRepo.findAll({
            where: filter,
        });
    },
    upsertRepo: async (data) => {
        return CiCdRepo.upsert(data);
    },
    deleteRepo: async (id) => {
        return CiCdRepo.destroy({
            where: { id },
        });
    },

    getServers: async (filter = {}) => {
        return CiCdServer.findAll({
            where: filter,
            include: CiCdRepo,
        });
    },
    upsertServer: async (data) => {
        return CiCdServer.upsert(data);
    },
    deleteServer: async (id) => {
        return CiCdServer.destroy({
            where: { id },
        });
    },

    getAllConfigServerOp: async () => {
        function renameKeys(obj, newKeys) {
            const keyValues = Object.keys(obj).map((key) => {
                const newKey = newKeys[key] || key;
                return { [newKey]: obj[key] };
            });
            return Object.assign({}, ...keyValues);
        }

        const newKeys = {
            site_name: 'SITE_NAME',
            remote_server: 'REMOTE_SERVER',
            build_application: 'BUILD_APPLICATION',
            database_migrate: 'DATABASE_MIGRATE',
            approval_mode: 'APPROVAL_MODE',
            branch_id: 'BRANCH_ID',
            application_directory: 'APPLICATION_DIRECTORY',
            skype_chat_chanel: 'SKYPE_CHAT_CHANEL',
            auto_build: 'AUTO_BUILD',
        };

        const allConfig = await CiCdServer.findAll({
            include: [
                {
                    model: CiCdRepo,
                    attributes: ['repo_name'],
                },
            ],
        });

        let result = allConfig.map((o) => {
            const res = renameKeys(o.dataValues, newKeys);
            res['REPO_ID'] = o?.ci_cd_repo?.repo_name || '';
            return res;
        });

        result.forEach((i) => {
            i.BUILD_APPLICATION = i.BUILD_APPLICATION ? 'ENABLE' : 'DISABLE';
            i.DATABASE_MIGRATE = i.DATABASE_MIGRATE ? 'ENABLE' : 'DISABLE';
            i.APPROVAL_MODE = i.APPROVAL_MODE ? 'ENABLE' : 'DISABLE';
            i.AUTO_BUILD = i.AUTO_BUILD ? 'ENABLE' : 'DISABLE';
            delete i.id;
            delete i.createdAt;
            delete i.updatedAt;
            delete i.ci_cd_repo;
        });

        return result;
    },
};
