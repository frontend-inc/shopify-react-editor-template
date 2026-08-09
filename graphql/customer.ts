// Customer account operations (classic Storefront customer accounts).
// https://shopify.dev/docs/api/storefront/latest/objects/Customer
import { gql } from '@shopify/hydrogen';

const CustomerFragment = gql(`
  fragment CustomerFragment on Customer {
    id
    email
    firstName
    lastName
    phone
    displayName
    acceptsMarketing
    createdAt
    defaultAddress {
      id
      firstName
      lastName
      address1
      address2
      city
      province
      zip
      country
      phone
    }
  }
`);

export const CUSTOMER_QUERY = gql(
  `
  query GetCustomer($customerAccessToken: String!, $orderCount: Int!) {
    customer(customerAccessToken: $customerAccessToken) {
      ...CustomerFragment
      orders(first: $orderCount, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            statusUrl
            currentTotalPrice {
              amount
              currencyCode
            }
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`,
  [CustomerFragment]
);

export const CUSTOMER_CREATE_MUTATION = gql(`
  mutation CustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`);

export const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = gql(`
  mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`);

export const CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION = gql(`
  mutation CustomerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      userErrors {
        field
        message
      }
    }
  }
`);

// Sends the "reset your password" email.
export const CUSTOMER_RECOVER_MUTATION = gql(`
  mutation CustomerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`);

// Completes the reset using the id + token from the emailed link.
export const CUSTOMER_RESET_MUTATION = gql(`
  mutation CustomerReset($id: ID!, $input: CustomerResetInput!) {
    customerReset(id: $id, input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`);

// Activation link sent to customers created by the merchant.
export const CUSTOMER_ACTIVATE_MUTATION = gql(`
  mutation CustomerActivate($id: ID!, $input: CustomerActivateInput!) {
    customerActivate(id: $id, input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`);

export const CUSTOMER_UPDATE_MUTATION = gql(
  `
  mutation CustomerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        ...CustomerFragment
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`,
  [CustomerFragment]
);
