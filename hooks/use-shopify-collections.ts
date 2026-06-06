'use client';

import { useState, useEffect, useCallback } from 'react';
import { shopifyFetch } from '@/services/shopify/client';
import {
  GET_COLLECTIONS_QUERY,
  GET_COLLECTION_PRODUCTS_QUERY,
} from '@/graphql/collections';
import type { Product } from './use-shopify-products';

interface CollectionImage {
  url: string;
  altText?: string;
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  descriptionHtml?: string;
  image?: CollectionImage;
}

export interface CollectionWithProducts extends Collection {
  products: Product[];
}

export type CollectionSortKey = 'BEST_SELLING' | 'CREATED' | 'PRICE' | 'TITLE';

export interface ProductFilter {
  available?: boolean;
  price?: { min?: number; max?: number };
  productType?: string;
  productVendor?: string;
  tag?: string;
  variantOption?: { name: string; value: string };
  productMetafield?: { namespace: string; key: string; value: string };
}

interface UseCollectionProductsOptions {
  first?: number;
  sortKey?: CollectionSortKey;
  reverse?: boolean;
  filters?: ProductFilter[];
}

// Fetch all collections
export async function getCollections(first = 50): Promise<Collection[]> {
  const response = await shopifyFetch({
    query: GET_COLLECTIONS_QUERY,
    variables: { first },
  });

  return response.data.collections.edges.map((edge: { node: Collection }) => edge.node);
}

// Fetch products in a collection by handle
export async function getCollectionProducts(
  handle: string,
  { first = 50, sortKey = 'BEST_SELLING', reverse = false, filters }: UseCollectionProductsOptions = {},
  after?: string | null,
): Promise<{ collection: CollectionWithProducts; hasNextPage: boolean; endCursor: string | null } | null> {
  const response = await shopifyFetch({
    query: GET_COLLECTION_PRODUCTS_QUERY,
    variables: { handle, first, sortKey, reverse, filters: filters?.length ? filters : undefined, after: after ?? null },
  });

  const collection = response.data.collection;
  if (!collection) return null;

  return {
    collection: {
      ...collection,
      products: collection.products.edges.map((edge: { node: Product }) => edge.node),
    },
    hasNextPage: collection.products.pageInfo.hasNextPage,
    endCursor: collection.products.pageInfo.endCursor,
  };
}

// Hook for fetching all collections
export function useCollections(first = 50) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCollections(first);
      setCollections(data);
    } catch (err) {
      console.error('Error fetching collections:', err);
      setError(err instanceof Error ? err.message : 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  }, [first]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return { collections, loading, error, refetch: fetchCollections };
}

// Hook for fetching products in a collection
export function useCollectionProducts(
  handle: string | null,
  options: UseCollectionProductsOptions = {}
) {
  const [collection, setCollection] = useState<CollectionWithProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);

  const filtersKey = JSON.stringify(options.filters ?? []);

  const fetchCollection = useCallback(async () => {
    if (!handle) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getCollectionProducts(handle, options);
      if (!result) {
        setCollection(null);
        setError('Collection not found');
      } else {
        setCollection(result.collection);
        setHasNextPage(result.hasNextPage);
        setCursor(result.endCursor);
      }
    } catch (err) {
      console.error('Error fetching collection products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load collection');
    } finally {
      setLoading(false);
    }
  }, [handle, options.first, options.sortKey, options.reverse, filtersKey]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  const fetchMore = useCallback(async () => {
    if (!handle || !cursor || !hasNextPage || loading) return;
    setLoading(true);
    try {
      const result = await getCollectionProducts(handle, options, cursor);
      if (result) {
        setCollection((prev) =>
          prev
            ? { ...prev, products: [...prev.products, ...result.collection.products] }
            : result.collection
        );
        setHasNextPage(result.hasNextPage);
        setCursor(result.endCursor);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load more failed');
    } finally {
      setLoading(false);
    }
  }, [handle, cursor, hasNextPage, loading, options.first, options.sortKey, options.reverse, filtersKey]);

  return { collection, loading, error, hasNextPage, fetchMore, refetch: fetchCollection };
}
