import { gql } from '@shopify/hydrogen';
import { ProductFragment } from '@/graphql/products';

export const GET_COLLECTIONS_QUERY = gql(`
  query GetCollections($first: Int!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);

export const GET_COLLECTION_PRODUCTS_QUERY = gql(
  `
  query GetCollectionProducts(
    $handle: String!
    $first: Int!
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      image {
        id
        url
        altText
        width
        height
      }
      products(
        first: $first
        after: $after
        sortKey: $sortKey
        reverse: $reverse
        filters: $filters
      ) {
        filters {
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
            ...ProductFragment
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`,
  [ProductFragment]
);
