const getApiParams = (method, token, data) => {
    const headers = {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json',
    };

    return {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
    };
};

const sleep = (millis) => {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(`Sleep for ${millis} seconds`);
        }, millis);
    });
};

const getMillisToSleep = (retryHeaderString) => {
    let millisToSleep = Math.round(parseFloat(retryHeaderString) * 1000);
    if (isNaN(millisToSleep)) {
        millisToSleep = 1000;
    }
    return millisToSleep;
};

const fetchAndRetryIfNecessary = async (callAPI) => {
    let response = await callAPI();
    if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after');
        const millisToSleep = getMillisToSleep(retryAfter);
        await sleep(millisToSleep);
        response = fetchAndRetryIfNecessary(callAPI);
    } else if (response.status === 500) {
        // retry one more time
        await sleep(1500);
        response = await callAPI();
    }
    return response;
};

module.exports = {
    sleep,
    getMillisToSleep,
    getApiParams,
    fetchAndRetryIfNecessary,
};
