const { EMAIL_SERVICE_URL, EMAIL_SERVICE_TOKEN } = process.env;

module.exports = {
    sendEmail: async ({
        toAddress,
        htmlData,
        subject,
        sourceEmail,
        senderName,
        replyToAddress,
        attachFile,
        domain,
    }) => {
        return await fetch(`https://${EMAIL_SERVICE_URL}/bss-ses/v2/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${EMAIL_SERVICE_TOKEN}` },
            body: JSON.stringify({
                toAddress,
                htmlData,
                subject,
                sourceEmail,
                senderName,
                replyToAddress,
                attachFile,
                domain,
            }),
        });
    },
};
