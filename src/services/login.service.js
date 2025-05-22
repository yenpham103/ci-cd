const { LOGIN_API_URL, LOGIN_VAHU_TOKEN } = process.env;

module.exports = {
    getCurrentSupportContent: async (domain, module, type, event) => {
        const request = await fetch(
            `${LOGIN_API_URL}/support?domain=${domain}&module=${module}&type=${type}&event=${event}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${LOGIN_VAHU_TOKEN}`,
                },
            }
        );

        if (request.statusText !== 'OK') {
            let message = request.statusText;
            if (request.status === 400) {
                message = (await request.json()).message;
            }
            throw new Error(message);
        }

        const response = await request.json();

        if (response?.data?.length) {
            const { supportVersions, ...data } = response.data[0];
            return { supportVersions, currentSupport: data };
        } else {
            return { supportVersions: [], currentSupport: '' };
        }
    },

    getVersionById: async (domain, id) => {
        const request = await fetch(`${LOGIN_API_URL}/support-version?domain=${domain}&id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${LOGIN_VAHU_TOKEN}`,
            },
        });

        if (request.statusText !== 'OK') {
            let message = request.statusText;
            if (request.status === 400) {
                message = (await request.json()).message;
            }
            throw new Error(message);
        }

        const response = await request.json();
        return response.success ? response.data : '';
    },

    updateContent: async (body) => {
        const request = await fetch(`${LOGIN_API_URL}/support/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${LOGIN_VAHU_TOKEN}`,
            },
            body: JSON.stringify(body),
        });

        if (request.statusText !== 'OK') {
            let message = request.statusText;
            if (request.status === 400) {
                message = (await request.json()).message;
            }
            throw new Error(message);
        }

        const response = await request.json();
        return response;
    },
};
