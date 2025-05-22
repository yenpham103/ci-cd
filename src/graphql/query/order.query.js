exports.ORDER_LIST_QUERY = `
    query ($first: Int, $last: Int, $after: String, $before: String, $query: String) {
        orders(first: $first, last: $last, after: $after, before: $before, query: $query, sortKey: CREATED_AT, reverse: true) {
            edges {
                node {
                    id
                    name
                    closed
                    processedAt
                    cancelledAt
                    createdAt
                    currentTotalPriceSet {
                        shopMoney {
                            amount
                            currencyCode
                            __typename
                        }
                        presentmentMoney {
                            amount
                            currencyCode
                            __typename
                        }
                    }
                    purchasingEntity {
                        ...on Customer {
                            firstName
                            lastName
                            email
                        }
                    }
                    displayFinancialStatus
                    displayFulfillmentStatus
                    currentSubtotalLineItemsQuantity
                    tags
                }
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
        }
    }
`;

exports.ORDER_BY_ID = `
    query ($id: ID!) {
        order(id: $id) {
            id
            name
            note
            processedAt
            clientIp
            closed
            confirmed
            currencyCode
            currentSubtotalLineItemsQuantity
            subtotalLineItemsQuantity
            app {
                name
            }
            customAttributes {
                key
                value
            }
            subtotalPriceSet {
                presentmentMoney {
                    amount
                    currencyCode
                }
            }
            taxesIncluded
            customer {
                id
                firstName
                lastName
                email
            }
            tags
            customerJourneySummary {
                customerOrderIndex
            }
            discountCode
            discountCodes
            displayFinancialStatus
            displayFulfillmentStatus
            netPaymentSet {
                presentmentMoney {
                    amount
                    currencyCode
                }
            }
            originalTotalPriceSet {
                presentmentMoney {
                    amount
                    currencyCode
                }
            }
            paymentGatewayNames
            refundable
            shippingAddress {
                address1
                address2
                name
                city
                zip
                company
                country
                phone
            }
            billingAddress {
                address1
                address2
                name
                city
                zip
                company
                country
                phone
            }
            billingAddressMatchesShippingAddress
            shippingLine {
                title
                originalPriceSet {
                    presentmentMoney {
                        amount
                        currencyCode
                    }
                }
                taxLines {
                    priceSet {
                        presentmentMoney {
                            amount
                            currencyCode
                        }
                    }
                title
                ratePercentage
                }
                discountedPriceSet {
                    presentmentMoney {
                        amount
                        currencyCode
                    }
                }
            }
            taxLines {
                title
                rate
                ratePercentage
                priceSet {
                    presentmentMoney {
                        amount
                        currencyCode
                    }
                }
            }
            taxesIncluded
            test
            totalWeight
        }
    }
`;

exports.ORDER_EVENTS = `
    query ($orderId: ID!, $first: Int) {
        order (id: $orderId) {
            events (first: $first) {
                nodes {
                    id
                    appTitle
                    attributeToApp
                    attributeToUser
                    criticalAlert
                    message
                    createdAt
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    }
`;

exports.ORDER_LINE_ITEMS = `
    query ($orderId: ID!, $first: Int, $after: String) {
        order (id: $orderId) {
            lineItems (first: $first, after: $after) {
                nodes {
                    id
                    sku
                    title
                    quantity
                    variantTitle
                    image {
                        url
                    }
                    discountAllocations {
                        allocatedAmountSet {
                            presentmentMoney {
                                amount
                                currencyCode
                            }
                        }
                    }
                    discountedTotalSet {
                        presentmentMoney {
                            amount
                            currencyCode
                        }
                    }
                    discountedUnitPriceSet {
                        presentmentMoney {
                            amount
                            currencyCode
                        }
                    }
                    originalUnitPriceSet {
                        presentmentMoney {
                            amount
                            currencyCode
                        }
                    }
                }
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    startCursor
                    endCursor
                }
            }
        }
    }
`;
