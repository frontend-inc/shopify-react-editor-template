'use client';

import { useState, useEffect } from 'react';
import { shopifyFetch } from '@/services/shopify/client';
import { GET_SEARCH_QUERY } from '@/graphql/products';
import type { Product } from '@/hooks/use-shopify-products';

export type SortOption =
  | 'RELEVANCE'
  | 'BEST_SELLING'
  | 'NEWEST'
  | 'PRICE_ASC'
  | 'PRICE_DESC'
  | 'TITLE_ASC';

export interface SearchFilters {
  q?: string;
  availability?: boolean;
  productTypes?: string[];
  vendors?: string[];
  tags?: string[];
  colors?: string[];
  styles?: string[];
  sizes?: string[];
  materials?: string[];
  minPrice?: number | null;
  maxPrice?: number | null;
  metafields?: { namespace: string; key: string; value: string }[];
  sort?: SortOption;
}

export interface SearchFacets {
  productTypes: string[];
  vendors: string[];
  tags: string[];
}

function resolveSortKey(sort: SortOption): { sortKey: string; reverse: boolean } {
  switch (sort) {
    case 'BEST_SELLING': return { sortKey: 'BEST_SELLING', reverse: false };
    case 'NEWEST':       return { sortKey: 'CREATED_AT',   reverse: true  };
    case 'PRICE_ASC':    return { sortKey: 'PRICE',        reverse: false };
    case 'PRICE_DESC':   return { sortKey: 'PRICE',        reverse: true  };
    case 'TITLE_ASC':    return { sortKey: 'TITLE',        reverse: false };
    default:             return { sortKey: 'RELEVANCE',    reverse: false };
  }
}

export function buildShopifyQuery(filters: SearchFilters): string {
  const parts: string[] = [];

  if (filters.q?.trim()) parts.push(filters.q.trim());

  if (filters.availability === true) parts.push('available_for_sale:true');

  if (filters.productTypes?.length) {
    const clause = filters.productTypes.map((t) => `product_type:"${t}"`).join(' OR ');
    parts.push(filters.productTypes.length > 1 ? `(${clause})` : clause);
  }

  if (filters.vendors?.length) {
    const clause = filters.vendors.map((v) => `vendor:"${v}"`).join(' OR ');
    parts.push(filters.vendors.length > 1 ? `(${clause})` : clause);
  }

  if (filters.tags?.length) {
    const clause = filters.tags.map((t) => `tag:"${t}"`).join(' OR ');
    parts.push(filters.tags.length > 1 ? `(${clause})` : clause);
  }

  for (const [option, values] of [
    ['color', filters.colors],
    ['style', filters.styles],
    ['size', filters.sizes],
    ['material', filters.materials],
  ] as const) {
    if (values?.length) {
      const clause = values.map((v) => `variant.option.${option}:"${v}"`).join(' OR ');
      parts.push(values.length > 1 ? `(${clause})` : clause);
    }
  }

  if (filters.minPrice != null) parts.push(`variants.price:>=${filters.minPrice}`);
  if (filters.maxPrice != null) parts.push(`variants.price:<=${filters.maxPrice}`);

  if (filters.metafields?.length) {
    for (const mf of filters.metafields) {
      parts.push(`metafield.${mf.namespace}.${mf.key}:"${mf.value}"`);
    }
  }

  return parts.join(' ');
}

async function fetchProducts(vars: {
  first: number;
  query: string;
  sortKey: string;
  reverse: boolean;
  after?: string | null;
}) {
  const res = await shopifyFetch({
    query: GET_SEARCH_QUERY,
    variables: { first: vars.first, query: vars.query, sortKey: vars.sortKey, reverse: vars.reverse, after: vars.after ?? null },
  });
  return {
    products: res.data.products.edges.map((e: { node: Product }) => e.node) as Product[],
    hasNextPage: res.data.products.pageInfo.hasNextPage as boolean,
    endCursor: res.data.products.pageInfo.endCursor as string | null,
  };
}

export function useShopifySearch(filters: SearchFilters, { first = 24 }: { first?: number } = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [facets, setFacets] = useState<SearchFacets>({ productTypes: [], vendors: [], tags: [] });
  const [loading, setLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const textQuery = filters.q?.trim() ?? '';
  const productQuery = buildShopifyQuery(filters);
  const { sortKey, reverse } = resolveSortKey(filters.sort ?? 'RELEVANCE');

  // Fetch facets from unfiltered (text-only) result so sidebar options don't narrow
  useEffect(() => {
    let cancelled = false;
    fetchProducts({ first: 100, query: textQuery, sortKey: 'RELEVANCE', reverse: false })
      .then(({ products: p }) => {
        if (cancelled) return;
        setFacets({
          productTypes: [...new Set(p.map((x) => x.productType).filter(Boolean))].sort() as string[],
          vendors:      [...new Set(p.map((x) => x.vendor).filter(Boolean))].sort() as string[],
          tags:         [...new Set(p.flatMap((x) => x.tags ?? []))].sort() as string[],
        });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [textQuery]);

  // Fetch products with all active filters
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchProducts({ first, query: productQuery, sortKey, reverse })
      .then(({ products: p, hasNextPage: hnp, endCursor: ec }) => {
        if (cancelled) return;
        setProducts(p);
        setHasNextPage(hnp);
        setCursor(ec);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Search failed');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [productQuery, sortKey, reverse, first]);

  const fetchMore = async () => {
    if (!cursor || !hasNextPage || loading) return;
    setLoading(true);
    try {
      const { products: more, hasNextPage: hnp, endCursor: ec } = await fetchProducts({
        first, query: productQuery, sortKey, reverse, after: cursor,
      });
      setProducts((prev) => [...prev, ...more]);
      setHasNextPage(hnp);
      setCursor(ec);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Load more failed');
    } finally {
      setLoading(false);
    }
  };

  return { products, facets, loading, error, hasNextPage, fetchMore };
}
