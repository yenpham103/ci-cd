'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.ENVIRONMENT || 'development';
const configs = require(__dirname + '/../config/database/db.config.js')[env];
const db = {};

for (const config of configs) {
    let sequelize;
    if (config.use_env_variable) {
        sequelize = new Sequelize(process.env[config.use_env_variable], config);
    } else {
        sequelize = new Sequelize(config.database, config.username, config.password, config);
    }

    const modelDirectory = path.join(__dirname, config.name);
    fs.readdirSync(modelDirectory)
        .filter((file) => {
            return file.indexOf('.') !== 0 && file.slice(-3) === '.js';
        })
        .forEach((file) => {
            const model = require(path.join(modelDirectory, file))(sequelize, Sequelize);
            db[model.name] = model;
        });

    Object.keys(db).forEach((modelName) => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    if (config.name === 'support') {
        db['permissions'].belongsTo(db['users'], { foreignKey: 'user_id', onDelete: 'cascade' });
        db['users'].hasOne(db['permissions'], { foreignKey: 'user_id' });

        db['shop_user_accesses'].belongsTo(db['users'], { foreignKey: 'user_id', as: 'user', onDelete: 'cascade' });
        db['users'].hasMany(db['shop_user_accesses'], { foreignKey: 'user_id', as: 'shopUserAccesses' });
        db['shop_user_accesses'].belongsTo(db['users'], {
            foreignKey: 'assigner_id',
            as: 'assigner',
            onDelete: 'cascade',
        });
        db['users'].hasMany(db['shop_user_accesses'], { foreignKey: 'assigner_id', as: 'assignedShopUserAccesses' });

        db['modules'].belongsTo(db['apps'], { foreignKey: 'app_id' });
        db['apps'].hasMany(db['modules'], { foreignKey: 'app_id' });
        db['endpoints'].belongsTo(db['modules'], { foreignKey: 'module_id' });
        db['modules'].hasMany(db['endpoints'], { foreignKey: 'module_id' });

        db['endpoints'].belongsTo(db['users'], { foreignKey: 'user_id' });
        db['users'].hasMany(db['endpoints'], { foreignKey: 'user_id' });

        db['versions'].belongsTo(db['themes'], { foreignKey: 'theme_id' });
        db['themes'].hasMany(db['versions'], { foreignKey: 'theme_id' });
        db['versions'].belongsTo(db['users'], { foreignKey: 'user_id' });
        db['users'].hasMany(db['versions'], { foreignKey: 'user_id' });

        db['sessions'].belongsTo(db['apps'], { foreignKey: 'app_id' });
        db['apps'].hasMany(db['sessions'], { foreignKey: 'app_id' });

        db['user_activity_logs'].belongsTo(db['users'], { foreignKey: 'user_id' });
        db['users'].hasMany(db['user_activity_logs'], { foreignKey: 'user_id' });

        db['support_issues'].belongsTo(db['apps'], { foreignKey: 'app_id', as: 'app', onDelete: 'cascade' });
        db['apps'].hasMany(db['support_issues'], { foreignKey: 'app_id' });

        db['support_issues'].belongsTo(db['modules'], { foreignKey: 'module_id', as: 'module', onDelete: 'cascade' });
        db['modules'].hasMany(db['support_issues'], { foreignKey: 'module_id' });

        db['support_issues'].belongsTo(db['users'], { foreignKey: 'reporter', as: 'report', onDelete: 'cascade' });
        db['users'].hasMany(db['support_issues'], { foreignKey: 'reporter' });

        db['support_issues_reacts'].belongsTo(db['support_issues'], { foreignKey: 'issue_id', as: 'issueId' });
        db['support_issues'].hasMany(db['support_issues_reacts'], { foreignKey: 'issue_id', as: 'react' });

        db['support_issues_reacts'].belongsTo(db['users'], { foreignKey: 'user_id', as: 'userId' });
        db['users'].hasMany(db['support_issues_reacts'], { foreignKey: 'user_id', as: 'react' });

        db['ci_cd_servers'].belongsTo(db['ci_cd_repos'], { foreignKey: 'config_repo_id' });
        db['ci_cd_repos'].hasMany(db['ci_cd_servers'], { foreignKey: 'config_repo_id' });

        // db['support_issues'].belongsToMany(db['users'], { foreignKey: 'issue_id', through: 'support_issues_reacts' });
        // db['users'].belongsToMany(db['support_issues'], { foreignKey: 'user_id', through: 'support_issues_reacts' });
    }

    if (config.name === 'bloop') {
        db['shopify_stores'].belongsTo(db['stores'], { foreignKey: 'id' });
        db['stores'].hasMany(db['shopify_stores'], { foreignKey: 'id', sourceKey: 'store_id' });
    }

    if (config.name === 'label') {
        db['libs'].hasMany(db['labels'], { foreignKey: 'lib_id' });
        db['labels'].belongsTo(db['libs'], { foreignKey: 'lib_id' });
        db['discountReport'].belongsTo(db['discountCodes'], { foreignKey: 'code_id' });
        db['shops'].hasMany(db['discountReport'], { foreignKey: 'store_id' });
    }

    if (config.name === 'locator') {
        db['discountReport'].belongsTo(db['discountCodes'], { foreignKey: 'discount_code_id' });
        db['auth'].hasMany(db['discountReport'], { foreignKey: 'shop_id' });
    }

    db[config.name] = {
        sequelize,
        Sequelize,
    };
}

module.exports = db;
