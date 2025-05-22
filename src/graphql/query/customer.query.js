exports.CUSTOMER_LIST_QUERY = `query customers($first: Int, $last: Int, $after: String, $before: String, $query: String) {
  customers(first: $first, last: $last, after: $after, before: $before, query: $query) {
        edges {
            node {
              id
              displayName
              email
              firstName
              lastName
              tags
              note
              state
              defaultAddress {
                city
                country
              }
              amountSpent {
                amount
                currencyCode
              }
              numberOfOrders
              locale
            }
            cursor
        }
          pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }
    }
}`;

exports.CUSTOMER_BY_ID = `
    query ($id: ID!) {
      customer(id: $id) {
          id
          displayName
          email
          firstName
          lastName
          tags
          note
          state
          defaultAddress {
            city
            country
          }
          amountSpent {
            amount
            currencyCode
          }
          numberOfOrders
          locale
          events(first:250) {  
            nodes {
                createdAt
                message
            }
          }
      }
    }
`;
