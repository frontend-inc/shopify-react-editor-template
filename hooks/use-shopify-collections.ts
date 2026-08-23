'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getCollections,
  getCollectionsPage,
  getCollectionProducts,
} from '@/services/shopify/shop';

export {
  getCollections,
  getCollectionsPage,
  getCollectionProducts,
  getCollectionProductsPage,
} from '@/services/shopify/shop';
export type {
  Collection,
  CollectionsPage,
  CollectionWithProducts,
  CollectionSortKey,
  CollectionProductsPage,
  ProductFilterFacet,
} from '@/services/shopify/shop';

import type {
  Collection,
  CollectionWithProducts,
  CollectionSortKey,
} from '@/services/shopify/shop';

interface UseCollectionProductsOptions {
  first?: number;
  after?: string | null;
  sortKey?: CollectionSortKey;
  reverse?: boolean;
  filterInputs?: string[];
}

export function useCollections(first = 50) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const page = await getCollectionsPage(first);
      setCollections(page.collections);
      setCursor(page.endCursor);
      setHasNextPage(page.hasNextPage);
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

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasNextPage) return;

    try {
      setLoadingMore(true);
      const page = await getCollectionsPage(first, cursor);

      setCollections((prev) => {
        const seen = new Set(prev.map((collection) => collection.id));
        return [...prev, ...page.collections.filter((c) => !seen.has(c.id))];
      });
      setCursor(page.endCursor);
      setHasNextPage(page.hasNextPage);
    } catch (err) {
      console.error('Failed to load more collections:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [first, cursor, hasNextPage, loadingMore]);

  return {
    collections,
    loading,
    loadingMore,
    error,
    hasNextPage,
    loadMore,
    refetch: fetchCollections,
  };
}

// Fetch once on demand for menus that may never open.
export function useCollectionsOnDemand(first = 50) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requested = useRef(false);

  const load = useCallback(async () => {
    if (requested.current) return;
    requested.current = true;

    try {
      setLoading(true);
      setError(null);
      setCollections(await getCollections(first));
    } catch (err) {
      console.error('Error fetching collections:', err);
      requested.current = false;
      setError(err instanceof Error ? err.message : 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  }, [first]);

  return { collections, loading, error, load };
}

export function useCollectionProducts(
  handle: string | null,
  options: UseCollectionProductsOptions = {}
) {
  const [collection, setCollection] = useState<CollectionWithProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollection = useCallback(async () => {
    if (!handle) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getCollectionProducts(handle, options);
      setCollection(data);
      if (!data) {
        setError('Collection not found');
      }
    } catch (err) {
      console.error('Error fetching collection products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load collection');
    } finally {
      setLoading(false);
    }
  }, [handle, options.first, options.sortKey, options.reverse]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  return { collection, loading, error, refetch: fetchCollection };
}
