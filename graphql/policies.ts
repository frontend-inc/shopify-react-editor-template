import { gql } from '@shopify/hydrogen';

// Shop policies are exposed on the `shop` object of the Storefront API.
// There is no lookup-by-handle field, so we fetch all of them and match.
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
