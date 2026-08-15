import { gql } from '@shopify/hydrogen';

export const GET_SHOP_POLICIES_QUERY = gql(`
  query GetShopPolicies {
    shop {
      privacyPolicy {
        id
        title
        handle
        body
        url
      }
      termsOfService {
        id
        title
        handle
        body
        url
      }
      refundPolicy {
        id
        title
        handle
        body
        url
      }
      shippingPolicy {
        id
        title
        handle
        body
        url
      }
      subscriptionPolicy {
        id
        title
        handle
        body
        url
      }
    }
  }
`);
