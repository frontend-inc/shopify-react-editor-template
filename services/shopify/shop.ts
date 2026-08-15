import type { StorefrontApi } from '@shopify/hydrogen';
import { storefront, unwrapStorefrontResult } from '@/services/shopify/client';
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_QUERY,
  QUERY_PRODUCT_RECOMMENDATIONS,
} from '@/graphql/products';
import {
  GET_COLLECTIONS_QUERY,
  GET_COLLECTION_PRODUCTS_QUERY,
} from '@/graphql/collections';
import {
  SEARCH_PRODUCTS_QUERY,
  SEARCH_SUGGESTIONS_QUERY,
} from '@/graphql/search';

interface ProductImage {
  url: string;
  altText?: string | null;
}

interface ProductPrice {
  amount: string;
  currencyCode: string;
}

interface ProductVariant {
  id: string;
  title: string;
  price: ProductPrice;
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  image?: ProductImage | null;
}

export interface ProductOptionValue {
  id: string;
  name: string;
  swatch?: {
    color?: string | null;
    image?: {
      previewImage?: {
        url: string;
      } | null;
    } | null;
  } | null;
  firstSelectableVariant?: {
    id: string;
    image?: ProductImage | null;
  } | null;
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
  optionValues?: ProductOptionValue[];
}

/** Detects Shopify's synthetic option for single-variant products. */
export const isDefaultTitleOption = (option: {
  name: string;
  values: string[];
}): boolean =>
  option.name === 'Title' &&
  option.values.length === 1 &&
  option.values[0] === 'Default Title';

export const isDefaultTitleSelection = (selection: {
  name: string;
  value: string;
}): boolean =>
  selection.name === 'Title' && selection.value === 'Default Title';

export interface Product {
  id: string;
  title: string;
  description?: string;
  descriptionHtml?: string;
  handle: string;
  images: {
    edges: Array<{
      node: ProductImage;
    }>;
  };
  priceRange: {
    minVariantPrice: ProductPrice;
  };
  compareAtPriceRange?: {
    minVariantPrice: ProductPrice;
  };
  variants: {
    edges: Array<{
      node: ProductVariant;
    }>;
  };
  options: ProductOption[];
}

interface UseProductsOptions {
  first?: number;
  after?: string | null;
  query?: string;
  sortKey?: 'BEST_SELLING' | 'CREATED_AT' | 'PRICE' | 'TITLE';
  reverse?: boolean;
}

export interface ProductsPage {
  products: Product[];
  hasNextPage: boolean;
  endCursor: string | null;
}

export async function getProducts(
  options: UseProductsOptions = {}
): Promise<Product[]> {
  const { products } = await getProductsPage(options);
  return products;
}

export async function getProductsPage({
  first = 20,
  after = null,
  query = '',
  sortKey = 'BEST_SELLING',
  reverse = false,
}: UseProductsOptions = {}): Promise<ProductsPage> {
  const data = unwrapStorefrontResult(
    await storefront.graphql(GET_PRODUCTS_QUERY, {
      variables: { first, after, query, sortKey, reverse },
    }),
    'GetProducts'
  );

  const { edges, pageInfo } = data.products;

  return {
    products: edges.map((edge: { node: Product }) => edge.node),
    hasNextPage: Boolean(pageInfo?.hasNextPage),
    endCursor: pageInfo?.endCursor ?? null,
  };
}

export async function getProduct(handle: string): Promise<Product | null> {
  const data = unwrapStorefrontResult(
    await storefront.graphql(GET_PRODUCT_QUERY, { variables: { handle } }),
    'GetProduct'
  );

  return data.product;
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const data = unwrapStorefrontResult(
    await storefront.graphql(QUERY_PRODUCT_RECOMMENDATIONS, {
      variables: { productId },
    }),
    'GetProductRecommendations'
  );

  return data.productRecommendations ?? [];
}


interface CollectionImage {
  url: string;
  altText?: string | null;
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  descriptionHtml?: string;
  image?: CollectionImage | null;
}

export interface CollectionWithProducts extends Collection {
  products: Product[];
}

export type CollectionSortKey =
  | 'COLLECTION_DEFAULT'
  | 'BEST_SELLING'
  | 'CREATED'
  | 'PRICE'
  | 'TITLE';

interface UseCollectionProductsOptions {
  first?: number;
  after?: string | null;
  sortKey?: CollectionSortKey;
  reverse?: boolean;
  filterInputs?: string[];
}

export interface CollectionProductsPage {
  collection: Collection | null;
  products: Product[];
  filters: ProductFilterFacet[];
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface ProductFilterFacet {
  id: string;
  label: string;
  type: 'LIST' | 'PRICE_RANGE' | 'BOOLEAN';
  values: Array<{
    id: string;
    label: string;
    count: number;
    input: string;
  }>;
}

export async function getCollections(first = 50): Promise<Collection[]> {
  const data = unwrapStorefrontResult(
    await storefront.graphql(GET_COLLECTIONS_QUERY, { variables: { first } }),
    'GetCollections'
  );

  return data.collections.edges.map((edge) => edge.node);
}

export async function getCollectionProducts(
  handle: string,
  options: UseCollectionProductsOptions = {}
): Promise<CollectionWithProducts | null> {
  const page = await getCollectionProductsPage(handle, options);
  if (!page.collection) return null;

  return { ...page.collection, products: page.products };
}

export async function getCollectionProductsPage(
  handle: string,
  {
    first = 50,
    after = null,
    sortKey = 'COLLECTION_DEFAULT',
    reverse = false,
    filterInputs = [],
  }: UseCollectionProductsOptions = {}
): Promise<CollectionProductsPage> {
  const filters = parseFilterInputs(filterInputs);

  const data = unwrapStorefrontResult(
    await storefront.graphql(GET_COLLECTION_PRODUCTS_QUERY, {
      variables: {
        handle,
        first,
        after,
        sortKey,
        reverse,
        filters: filters.length ? filters : null,
      },
    }),
    'GetCollectionProducts'
  );

  const collection = data.collection;
  if (!collection) {
    return {
      collection: null,
      products: [],
      filters: [],
      hasNextPage: false,
      endCursor: null,
    };
  }

  const { edges, pageInfo, filters: facets } = collection.products;

  return {
    collection,
    products: edges.map((edge: { node: Product }) => edge.node),
    filters: facets ?? [],
    hasNextPage: Boolean(pageInfo?.hasNextPage),
    endCursor: pageInfo?.endCursor ?? null,
  };
}


export type SearchSortKey = 'RELEVANCE' | 'PRICE';

export interface SearchFilterValue {
  id: string;
  label: string;
  count: number;
  input: string;
}

export interface SearchFilter {
  id: string;
  label: string;
  type: 'LIST' | 'PRICE_RANGE' | 'BOOLEAN';
  values: SearchFilterValue[];
}

export interface SearchProductsResult {
  products: Product[];
  totalCount: number;
  filters: SearchFilter[];
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface SearchSuggestion {
  id: string;
  title: string;
  handle: string;
  featuredImage?: {
    url: string;
    altText?: string | null;
  } | null;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

interface SearchProductsOptions {
  query: string;
  first?: number;
  after?: string | null;
  sortKey?: SearchSortKey;
  reverse?: boolean;
  filterInputs?: string[];
}

type ProductFilterInput = NonNullable<
  StorefrontApi.VariablesOf<typeof GET_COLLECTION_PRODUCTS_QUERY>['filters']
>[number];

// Shopify facet inputs are opaque JSON values intended for round-tripping.
function parseFilterInputs(inputs: string[]): ProductFilterInput[] {
  return inputs.flatMap((input) => {
    try {
      return [JSON.parse(input) as ProductFilterInput];
    } catch {
      console.warn('Ignoring malformed product filter input:', input);
      return [];
    }
  });
}

export async function searchProducts({
  query,
  first = 24,
  after = null,
  sortKey = 'RELEVANCE',
  reverse = false,
  filterInputs = [],
}: SearchProductsOptions): Promise<SearchProductsResult> {
  const data = unwrapStorefrontResult(
    await storefront.graphql(SEARCH_PRODUCTS_QUERY, {
      variables: {
        query,
        first,
        after,
        sortKey,
        reverse,
        productFilters: filterInputs.length
          ? parseFilterInputs(filterInputs)
          : null,
      },
    }),
    'SearchProducts'
  );

  const search = data.search;

  return {
    products: search.edges
      .map((edge) => edge.node)
      .filter((node): node is Extract<typeof node, { __typename: 'Product' }> =>
        node.__typename === 'Product'
      ),
    totalCount: search.totalCount ?? 0,
    filters: search.productFilters ?? [],
    hasNextPage: Boolean(search.pageInfo?.hasNextPage),
    endCursor: search.pageInfo?.endCursor ?? null,
  };
}

export async function searchSuggestions(
  query: string,
  first = 3
): Promise<{ products: SearchSuggestion[]; totalCount: number }> {
  const data = unwrapStorefrontResult(
    await storefront.graphql(SEARCH_SUGGESTIONS_QUERY, {
      variables: { query, first },
    }),
    'SearchSuggestions'
  );

  const search = data.search;

  return {
    products: search.edges
      .map((edge) => edge.node)
      .filter((node): node is Extract<typeof node, { __typename: 'Product' }> =>
        node.__typename === 'Product'
      ),
    totalCount: search.totalCount ?? 0,
  };
}
