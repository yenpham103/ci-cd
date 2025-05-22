const { Op } = require('sequelize');
const RedisService = require('./redis.service');

const ShopLogin = require('../models')['login'].sequelize.models.shops;
const ShopSolution = require('../models')['solution'].sequelize.models.shops;
const ShopLabel = require('../models')['label'].sequelize.models.shops;
const ShopPortal = require('../models')['portal'].sequelize.models.shops;
const ShopLocator = require('../models')['locator'].sequelize.models.auth;
const ShopBloop = require('../models')['bloop'].sequelize.models.shopify_stores;
const StoreBloop = require('../models')['bloop'].sequelize.models.stores;
const ShopOption = require('../models')['option'].sequelize.models.shops;
const ShopMida = require('../models/mida/shops');
const ShopBanner = require('../models')['banner'].sequelize.models.shops;
module.exports = {
    findOne: async ({ type, domain, status }, options) => {
        const filter = {
            where: {
                domain: domain,
            },
            attributes: ['domain'],
            ...options,
        };

        switch (type) {
            case 'app_login':
                filter.where.installed = status;
                return await ShopLogin.findOne(filter);

            case 'app_solution':
                filter.where.status = status;
                filter.where.plan_name = {
                    [Op.notIn]: ['frozen', 'cancelled'],
                };
                return await ShopSolution.findOne(filter);

            case 'app_label':
                filter.where.enable = status;
                return await ShopLabel.findOne(filter);

            case 'app_portal':
                filter.where.status = status;
                filter.where.plan_name = {
                    [Op.notIn]: ['frozen', 'cancelled'],
                };
                return await ShopPortal.findOne(filter);

            case 'app_locator': {
                filter.where = {
                    status: 1,
                    shop: { domain: domain },
                };
                filter.attributes = ['shop'];
                if (options.attributes?.includes('token')) {
                    filter.attributes = ['accessToken'];
                }
                return await ShopLocator.findOne(filter);
            }

            case 'app_bloop': {
                filter.where = {
                    shopify_domain: domain,
                    '$store.status$': 1,
                };
                filter.include = [StoreBloop];
                filter.attributes = ['shopify_domain'];
                if (options.attributes?.includes('token')) {
                    filter.attributes = ['shopify_access_token'];
                }
                const shopBloop = await ShopBloop.findAndCountAll(filter);
                const convertedData = shopBloop.rows.map((row) => {
                    return { domain: row.shopify_domain, token: row.shopify_access_token };
                });

                return {
                    ...shopBloop,
                    rows: convertedData,
                };
            }
            case 'app_option':
                filter.where.enable = status;
                return await ShopOption.findOne(filter);

            case 'app_banner': {
                filter.where.active = status;
                filter.attributes = [...filter.attributes, 'active'];
                return await ShopBanner.findOne(filter);
            }

            default:
                return;
        }
    },
    findAll: async ({ type, status, domain, limit = 5, offset = 0 }, options) => {
        const filter = {
            limit,
            offset,
            where: {
                domain: { [Op.like]: `%${domain}%` },
            },
            attributes: ['domain'],
            ...options,
        };

        switch (type) {
            case 'app_login':
                filter.where.installed = status;
                filter.attributes = [...filter.attributes, 'installed'];
                return await ShopLogin.findAndCountAll(filter);

            case 'app_mida': {
                let attributes = {
                    domain: true,
                    status: true,
                };
                let filterMida = {
                    status: status ? true : false,
                };
                if (domain) {
                    filterMida.domain = {
                        $regex: `.*${domain}.*`,
                    };
                }
                if (options.attributes?.includes('token')) {
                    attributes['access_token'] = true;
                }
                const shops = await ShopMida.find({ ...filterMida }, { ...attributes })
                    .skip(offset)
                    .limit(limit);
                const count = await ShopMida.countDocuments({ ...filterMida });
                return {
                    count: count,
                    rows: shops.map((shop) => ({
                        domain: shop.domain,
                        token: shop.access_token,
                        status: shop.status,
                    })),
                };
            }

            case 'app_solution':
                filter.where.status = status;
                filter.attributes = [...filter.attributes, 'status'];
                filter.where.plan_name = {
                    [Op.notIn]: ['frozen', 'cancelled'],
                };
                return await ShopSolution.findAndCountAll(filter);

            case 'app_label':
                filter.where.enable = status;
                filter.attributes = [...filter.attributes, 'enable'];
                return await ShopLabel.findAndCountAll(filter);

            case 'app_portal':
                filter.where.status = status;
                filter.attributes = [...filter.attributes, 'status'];
                filter.where.plan_name = {
                    [Op.notIn]: ['frozen', 'cancelled'],
                };
                return await ShopPortal.findAndCountAll(filter);

            case 'app_locator': {
                filter.where = {
                    status: status,
                    shop: { [Op.like]: `%${domain}%` },
                };
                filter.attributes = ['shop', 'status'];
                if (options.attributes?.includes('token')) {
                    filter.attributes.push(...['accessToken']);
                }
                const shopLocators = await ShopLocator.findAndCountAll(filter);
                const convertedData = shopLocators.rows.map((row) => {
                    const convertedRow = {
                        domain: row.shop,
                        token: row.accessToken,
                        status: row.status,
                    };
                    return convertedRow;
                });
                return {
                    ...shopLocators,
                    rows: convertedData,
                };
            }

            case 'app_bloop': {
                filter.where = {
                    shopify_domain: { [Op.like]: `%${domain}%` },
                    '$store.status$': status,
                };
                filter.include = [StoreBloop];
                filter.attributes = ['shopify_domain'];
                if (options.attributes?.includes('token')) {
                    filter.attributes = ['shopify_access_token'];
                }
                const shopBloop = await ShopBloop.findAndCountAll(filter);
                const convertedData = shopBloop.rows.map((row) => {
                    return { domain: row.shopify_domain, token: row.shopify_access_token, status: row.store.status };
                });

                return {
                    ...shopBloop,
                    rows: convertedData,
                };
            }

            case 'app_option':
                filter.where.status = status;
                filter.attributes = [...filter.attributes, 'status'];
                return await ShopOption.findAndCountAll(filter);

            case 'app_banner': {
                filter.where.active = status;
                filter.attributes = [...filter.attributes, 'active'];
                const data = await ShopBanner.findAndCountAll(filter);
                return data;
            }
            default:
                return;
        }
    },

    setShopCache: async ({ domain, appType, shop, options = {} }) => {
        return await RedisService.set(`${domain}-${appType}`, JSON.stringify(shop), options);
    },

    getShopCache: async ({ domain, appType }) => {
        let shopCache = await RedisService.get(`${domain}-${appType}`);
        if (shopCache) {
            return JSON.parse(shopCache);
        }
        return null;
    },
};
