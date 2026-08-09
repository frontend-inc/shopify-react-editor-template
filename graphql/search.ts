import { gql } from '@shopify/hydrogen';
import { ProductFragment } from '@/graphql/products';

// Storefront search over products. `productFilters` accepts the raw `input`
// values returned in `productFilters[].values[].input`, so facets round-trip
// without the client needing to know each filter's shape.
export const SEARCH_PRODUCTS_QUERY = gql(
  `
  query SearchProducts(
    $query: String!
    $first: Int!
    $after: String
    $sortKey: SearchSortKeys
    $reverse: Boolean
    $productFilters: [ProductFilter!]
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    search(
      query: $query
      first: $first
      after: $after
      types: PRODUCT
      sortKey: $sortKey
      reverse: $reverse
      productFilters: $productFilters
    ) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      productFilters {
        id
        label
        type
        values {
          id
          label
          count
          input
        }
      }
      edges {
        node {
          # types: PRODUCT already narrows the results, but the schema still
          # types nodes as a union — __typename lets callers narrow too.
          __typename
          ... on Product {
            ...ProductFragment
          }
        }
      }
    }
  }
`,
  [ProductFragment]
);

// Lightweight variant for the autocomplete dropdown — just enough to render a
// row, so the dialog stays responsive while typing.
export const SEARCH_SUGGESTIONS_QUERY = gql(`
  query SearchSuggestions($query: String!, $first: Int!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    search(query: $query, first: $first, types: PRODUCT) {
      totalCount
      edges {
        node {
          __typename
          ... on Product {
            id
            title
            handle
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`);
