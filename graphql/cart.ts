import { gql } from '@shopify/hydrogen';

// Cart Fragment for consistent cart data
const CartFragment = gql(`
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    discountCodes {
      code
      applicable
    }
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              price {
                amount
                currencyCode
              }
              image {
                id
                url
                altText
                width
                height
              }
              product {
                id
                title
                handle
                vendor
              }
            }
          }
        }
      }
    }
  }
`);

// Create a new cart
export const CREATE_CART_MUTATION = gql(
  `
  mutation CreateCart($lines: [CartLineInput!], $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`,
  [CartFragment]
);

// Add lines to cart
export const ADD_CART_LINES_MUTATION = gql(
  `
  mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`,
  [CartFragment]
);

// Update cart lines
export const UPDATE_CART_LINES_MUTATION = gql(
  `
  mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`,
  [CartFragment]
);

// Remove lines from cart
export const REMOVE_CART_LINES_MUTATION = gql(
  `
  mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`,
  [CartFragment]
);

// Apply (or clear) discount codes on the cart
export const UPDATE_CART_DISCOUNT_CODES_MUTATION = gql(
  `
  mutation UpdateCartDiscountCodes($cartId: ID!, $discountCodes: [String!]!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`,
  [CartFragment]
);

// Get cart by ID
export const GET_CART_QUERY = gql(
  `
  query GetCart($cartId: ID!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }
`,
  [CartFragment]
);
