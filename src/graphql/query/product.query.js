exports.PRODUCT_LIST_QUERY = `query products($first: Int, $last: Int, $after: String, $before: String, $query: String) {
    products(first: $first, last: $last, after: $after, before: $before, query: $query) {
        edges {
            node {
                id
                title
                status
                totalInventory
                featuredImage {
                    transformedSrc
                }
                vendor
            }
        }
        pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
        }
    }
}`;

exports.PRODUCT_BY_ID = `
    query ($id: ID!) {
        product(id: $id) {
            id
            title
            createdAt
            description
            onlineStoreUrl
            tags
            seo {
                title
                description
            }
            onlineStorePreviewUrl
            featuredImage {
                transformedSrc
            }
            priceRangeV2 {
                minVariantPrice {
                    amount
                    currencyCode
                }
                maxVariantPrice {
                    amount
                    currencyCode
                }
            }
            productCategory {
                productTaxonomyNode {
                    name
                }
            }
            publishedAt
            variants(first: 15) {
                edges {
                  node {
                    id
                    title
                    displayName
                    image {
                      url
                    }
                    price
                    weight
                    weightUnit
                    inventoryQuantity
                  }
                  cursor
                }
            }
            collections(first: 15) {
                edges{
                    node {
                     id
                     title
                     handle  
                    }
                }
            }
        }
    }
`;
