const shopifyGraphQLClient = require('../../utils/shopifyGraphql');

const APP_SUBSCRIPTION_TRIAL_EXTEND = `
    mutation AppSubscriptionTrialExtend($id: ID!, $days: Int!) {
      appSubscriptionTrialExtend(id: $id, days: $days) {
        userErrors {
          field
          message
          code
        }
        appSubscription {
          id
          status
        }
      }
    }
`;

module.exports = {
    updateAppSubscriptionTrialExtend: async (domain, token, charge_id, days) => {
        return await shopifyGraphQLClient.post({
            domain,
            query: APP_SUBSCRIPTION_TRIAL_EXTEND,
            token,
            variables: {
                id: `gid://shopify/AppSubscription/${charge_id}`,
                days: days,
            },
        });
    },
};
