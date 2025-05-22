const { sleep, getMillisToSleep } = require('./shopifyApi');
const { SHOPIFY_API_VERSION } = process.env;

const fetchWithRetryBasedOnCost = async (fetchAPI) => {
    let retry = true;
    let responseJson = null;

    while (retry) {
        const response = await fetchAPI();
        responseJson = await response.json();

        if (
            responseJson.errors &&
            responseJson.errors.length &&
            responseJson.errors[0]?.extensions?.code === 'THROTTLED'
        ) {
            const requestedQueryCost = responseJson.extensions.cost.requestedQueryCost;
            const currentlyAvailable = responseJson.extensions.cost.throttleStatus.currentlyAvailable;
            const restoreRate = responseJson.extensions.cost.throttleStatus.restoreRate;
            const timeToRestoreCost = Math.ceil((requestedQueryCost - currentlyAvailable) / restoreRate);
            const millisToSleep = getMillisToSleep(timeToRestoreCost);
            await sleep(millisToSleep);
        } else {
            retry = false;
        }
    }

    return responseJson;
};

const shopifyGraphQLClient = {
    post: async ({ domain, token, query, variables }) => {
        return await fetchWithRetryBasedOnCost(() => {
            return fetch(`https://${domain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': token,
                },
                body: JSON.stringify({
                    query,
                    variables,
                }),
            });
        });
    },
};

module.exports = shopifyGraphQLClient;
