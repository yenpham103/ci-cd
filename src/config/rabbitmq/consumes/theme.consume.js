const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const ThemeService = require('../../../services/theme.service');
const EmailService = require('../../../services/email.service');
const { fetchAndRetryIfNecessary } = require('../../../utils/shopifyApi');
const logger = require('../../../log');
const { createError } = require('../../../utils/error');
const { uploadFileToS3, getUrlToDownload } = require('../../aws/aws.config');
const { getNowString } = require('../../../utils/formatDate');

const downloadTheme = async ({ domain, token, themeId, email }) => {
    const data = await ThemeService.findAllAsset({ domain, token, themeId, fields: 'key' });
    if (!data || !data.assets) {
        throw createError(400, 'Assets not found');
    }

    const pathSave = __dirname.replace('/config/rabbitmq/consumes', '');
    const timeSave = getNowString();
    const fileNameTheme = `${themeId}__${timeSave}.zip`;
    const filePath = pathSave + '/uploads/' + fileNameTheme;
    try {
        const output = fs.createWriteStream(filePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        archive.pipe(output);

        let assetData;
        for (const asset of data.assets) {
            const folder = path.dirname(asset.key);
            const fileName = path.basename(asset.key);
            const res = await fetchAndRetryIfNecessary(async () => {
                return await ThemeService.findSingleAssetRes({
                    domain,
                    token,
                    themeId,
                    key: asset.key,
                    fields: 'value',
                });
            });
            if (res && res.status === 200) {
                assetData = await res.json();
                if (assetData?.asset?.value) {
                    archive.append(assetData.asset.value, { name: `${folder}/${fileName}` });
                }
            }
        }

        archive.finalize();

        // Upload file to S3 and get download url
        await uploadFileToS3({
            domain,
            path: filePath,
            name: fileNameTheme,
            file: fs.createReadStream(filePath),
            type: 'application/zip',
        });
        const fileUrl = await getUrlToDownload({ domain, name: fileNameTheme });

        // Send email download
        const sendEmailReq = await EmailService.sendEmail({
            toAddress: email,
            subject: `Theme export for ${domain}`,
            sourceEmail: 'no-reply-shopify@bsscommerce.com',
            replyToAddress: null,
            htmlData: `Your <a href="${fileUrl}" style="color:#ff8000;text-decoration:none;">theme export</a> is ready to download.`,
        });
        const sendEmailRes = await sendEmailReq.json();
        if (!sendEmailRes || !sendEmailRes.success) {
            throw sendEmailRes.message;
        }
    } finally {
        fs.unlink(filePath, (err) => {
            if (err) throw createError(400, 'File deletion failed');
        });
    }
};

module.exports = {
    handleDownloadThemeConsume: async (message, channel) => {
        const { domain, token, themeId, email, user } = JSON.parse(message.content.toString());

        try {
            await downloadTheme({ domain, token, themeId, email });
            channel.ack(message);
            logger.info(__filename, `Theme-${themeId}: Success`, user, domain);
        } catch (error) {
            logger.error(__filename, `Theme-${themeId}: ${error.message}`, user, domain);
            channel.nack(message, false, false);
        }
    },
};
