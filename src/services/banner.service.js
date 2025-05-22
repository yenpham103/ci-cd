const crypto = require('crypto');
const BannerSupport = require('../models')['banner'].sequelize.models.bannerSupport;
const BannerSupportLog = require('../models')['banner'].sequelize.models.bannerSupportLog;

const FormData = require('form-data');
const fs = require('fs');
const fetchData = require('node-fetch');

module.exports = {
    transferDataFromLabel: async (domain) => {
        const body = JSON.stringify({ domain });
        const hmac = crypto.createHmac('sha256', process.env.BANNER_SECRET).update(body).digest('hex');
        const response = await fetch(`${process.env.BANNER_API_URL}/shop/transferOldConfig`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hmac-sign': hmac,
            },
            body: body,
        });
        if (!response.ok) {
            throw Error('Transfer data failed');
        }
        return await response.json();
    },
    removeWatermark: async (domain) => {
        const body = JSON.stringify({ domain });
        const hmac = crypto.createHmac('sha256', process.env.BANNER_SECRET).update(body).digest('hex');
        const response = await fetch(`${process.env.BANNER_API_URL}/shop/removeWatermark`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hmac-sign': hmac,
            },
            body: body,
        });
        if (!response.ok) {
            throw Error('Remove watermark failed');
        }
        return await response.json();
    },
    findByDomain: async (domain) => {
        return BannerSupport.findOne({ where: { shop_domain: domain } });
    },
    updateContent: async (domain, content, user) => {
        const endpoint = process.env.BANNER_API_URL + '/support/upsertCode';
        const body = JSON.stringify({ domain, content, user });
        const hmac = crypto.createHmac('sha256', process.env.BANNER_SECRET).update(body).digest('hex');
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hmac-sign': hmac,
            },
            body,
        });
        if (!response.ok) {
            let message = response.statusText;
            if (response.status === 400) {
                message = (await response.json()).message;
            }
            throw new Error(message);
        }
    },
    getVersionList: (domain, limit) => {
        return BannerSupportLog.findAll({
            limit,
            where: { shop_domain: domain },
            attributes: ['id', 'created_at', 'user'],
            order: [['created_at', 'DESC']],
        });
    },
    getVersion: (id, domain) => {
        return BannerSupportLog.findOne({
            where: { id, shop_domain: domain },
        });
    },
    enableTranslateFeature: async (domain) => {
        const body = JSON.stringify({ domain });
        const hmac = crypto.createHmac('sha256', process.env.BANNER_SECRET).update(body).digest('hex');
        const response = await fetch(`${process.env.BANNER_API_URL}/shop/enableTranslateFeature`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hmac-sign': hmac,
            },
            body: body,
        });
        if (!response.ok) {
            throw Error('Enable translate feature failed');
        }
        return await response.json();
    },

    getPartnerApps: async () => {
        const body = JSON.stringify({});
        const hmac = crypto.createHmac('sha256', process.env.BANNER_SECRET).update(body).digest('hex');
        const response = await fetch(`${process.env.BANNER_API_URL}/partner-app/getAll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hmac-sign': hmac,
            },
            body: body,
        });
        if (!response.ok) {
            throw Error('Get partner apps feature failed');
        }
        return await response.json();
    },
    createPartnerApp: async (data) => {
        const body = JSON.stringify(data);
        const hmac = crypto.createHmac('sha256', process.env.BANNER_SECRET).update(body).digest('hex');
        const response = await fetch(`${process.env.BANNER_API_URL}/partner-app/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hmac-sign': hmac,
            },
            body: body,
        });
        if (!response.ok) {
            throw Error('Create partner app failed');
        }
        return await response.json();
    },
    updatePartnerApp: async (id, data) => {
        const body = JSON.stringify(data);
        const hmac = crypto.createHmac('sha256', process.env.BANNER_SECRET).update(body).digest('hex');
        const response = await fetch(`${process.env.BANNER_API_URL}/partner-app/update/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hmac-sign': hmac,
            },
            body: body,
        });
        if (!response.ok) {
            throw Error('Update partner app failed');
        }
        return await response.json();
    },
    deletePartnerApp: async (id) => {
        const body = JSON.stringify({});
        const hmac = crypto.createHmac('sha256', process.env.BANNER_SECRET).update(body).digest('hex');
        const response = await fetch(`${process.env.BANNER_API_URL}/partner-app/delete/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hmac-sign': hmac,
            },
            body: body,
        });
        if (!response.ok) {
            throw Error('Update partner app failed');
        }
        return await response.json();
    },
    // bulkDelete
    getImageLibrary: async (ruleType) => {
        const body = JSON.stringify({});
        const hmac = crypto.createHmac('sha256', process.env.BANNER_SECRET).update(body).digest('hex');
        const query = ruleType ? `?module=${ruleType}` : '';
        const response = await fetch(`${process.env.BANNER_API_URL}/library/bannerLibs-vahu${query}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hmac-sign': hmac,
            },
            body: body,
        });
        if (!response.ok) {
            throw Error('Get Image Library feature failed');
        }
        const responseData = await response.json();
        if (responseData.success) {
            return responseData.data.map((library) => ({
                ...library,
                imageCount: library._count.lib_images,
            }));
        }
        return [];
    },
    createImageLibrary: async (ruleType, data) => {
        const body = JSON.stringify({
            ...data,
            sort_order: Number(data.sort_order ?? 0),
        });
        const query = ruleType ? `?module=${ruleType}` : '';
        const hmac = crypto.createHmac('sha256', process.env.BANNER_SECRET).update(body).digest('hex');
        const response = await fetch(`${process.env.BANNER_API_URL}/library/create-image-library-vahu${query}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hmac-sign': hmac,
            },
            body: body,
        });
        if (!response.ok) {
            throw Error('Create library failed');
        }
        return await response.json();
    },
    updateImageLibrary: async (libraryId, data) => {
        const body = JSON.stringify(data);
        const hmac = crypto.createHmac('sha256', process.env.BANNER_SECRET).update(body).digest('hex');
        const response = await fetch(`${process.env.BANNER_API_URL}/library/update-image-library-vahu/${libraryId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hmac-sign': hmac,
            },
            body: body,
        });
        if (!response.ok) {
            throw Error('Update library failed');
        }
        return await response.json();
    },
    deleteImageLibrary: async (libraryId) => {
        const body = JSON.stringify({});
        const hmac = crypto.createHmac('sha256', process.env.BANNER_SECRET).update(body).digest('hex');
        const response = await fetch(`${process.env.BANNER_API_URL}/library/delete-image-library-vahu/${libraryId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hmac-sign': hmac,
            },
            body: body,
        });
        if (!response.ok) {
            throw Error('Delete library failed');
        }
        return await response.json();
    },
    getImagesByLibId: async (libraryId) => {
        const body = JSON.stringify({});
        const hmac = crypto.createHmac('sha256', process.env.BANNER_SECRET).update(body).digest('hex');
        const response = await fetch(`${process.env.BANNER_API_URL}/library/get-images-by-lib-id-vahu/${libraryId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hmac-sign': hmac,
            },
            body: body,
        });
        if (!response.ok) {
            throw Error('Get Images feature failed');
        }
        return await response.json();
    },
    uploadImage: async (libraryId, file) => {
        const form = new FormData();
        form.append('libraryImage', fs.createReadStream(file.filepath), file.originalFilename);
        const response = await fetchData(
            `${process.env.BANNER_API_URL}/library/upload-image-in-library-vahu/${libraryId}`,
            {
                method: 'POST',
                body: form,
                // headers: form.getHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return await response.json();
    },
    bulkUpdate: async (data) => {
        const body = JSON.stringify({
            ...data,
            lib_id: Number(data.lib_id),
            sort_order: Number(data.sort_order ?? 0),
            name: data?.name ?? null,
        });
        const hmac = crypto.createHmac('sha256', process.env.BANNER_SECRET).update(body).digest('hex');
        const response = await fetch(`${process.env.BANNER_API_URL}/library/bulk-update-vahu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hmac-sign': hmac,
            },
            body: body,
        });
        if (!response.ok) {
            throw Error('Update bulk failed');
        }
        return await response.json();
    },
    bulkDelete: async (data) => {
        const body = JSON.stringify({
            ...data,
            lib_id: Number(data.lib_id),
        });
        const hmac = crypto.createHmac('sha256', process.env.BANNER_SECRET).update(body).digest('hex');
        const response = await fetch(`${process.env.BANNER_API_URL}/library/bulk-delete-vahu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hmac-sign': hmac,
            },
            body: body,
        });
        if (!response.ok) {
            throw Error('Delete bulk failed');
        }
        return await response.json();
    },
};
