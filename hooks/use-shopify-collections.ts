'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getCollections,
  getCollectionProducts,
} from '@/services/shopify/catalog';

export {
  getCollections,
  getCollectionProducts,
  getCollectionProductsPage,
} from '@/services/shopify/catalog';
export type {
  Collection,
  CollectionWithProducts,
  CollectionSortKey,
  CollectionProductsPage,
  ProductFilterFacet,
} from '@/services/shopify/catalog';

import type {
  Collection,
  CollectionWithProducts,
  CollectionSortKey,
} from '@/services/shopify/catalog';

interface UseCollectionProductsOptions {
  first?: number;
  after?: string | null;
  sortKey?: CollectionSortKey;
  reverse?: boolean;
  filterInputs?: string[];
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

// Deferred variant of useCollections: nothing is requested until `load` runs,
// so a menu can hold off until it's actually opened. The fetch happens once —
// re-opening reuses what's already in state.
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
      // Let the next open (or a retry) try again.
      requested.current = false;
      setError(err instanceof Error ? err.message : 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  }, [first]);

  return { collections, loading, error, load };
}

// Hook for fetching products in a collection
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
