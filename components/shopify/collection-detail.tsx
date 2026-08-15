'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from './product-card';
import ProductFilters, { type ProductFilterFacet } from './product-filters';
import ProductToolbar from './product-toolbar';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import {
  getCollectionProductsPage,
  type CollectionSortKey,
} from '@/hooks/use-shopify-collections';
import type { Product } from '@/hooks/use-shopify-products';

const PAGE_SIZE = 24;

const GRID_CLASSES =
  'grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12';

interface SortOption {
  label: string;
  sortKey: CollectionSortKey;
  reverse: boolean;
}

const SORT_OPTIONS: SortOption[] = [
  { label: 'Featured', sortKey: 'COLLECTION_DEFAULT', reverse: false },
  { label: 'Best Selling', sortKey: 'BEST_SELLING', reverse: false },
  { label: 'Price: Low to High', sortKey: 'PRICE', reverse: false },
  { label: 'Price: High to Low', sortKey: 'PRICE', reverse: true },
  { label: 'Newest', sortKey: 'CREATED', reverse: true },
];

interface CollectionDetailProps {
  handle?: string;
  title?: string;
}

const CollectionDetail: React.FC<CollectionDetailProps> = ({
  handle: handleProp,
  title: titleProp,
}) => {
  const params = useParams();
  const handle = handleProp || (params?.handle as string);

  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFilterFacet[]>([]);
  const [title, setTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [sortIndex, setSortIndex] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const sort = SORT_OPTIONS[sortIndex];
  const activeKey = useMemo(() => activeFilters.join('|'), [activeFilters]);

  const formattedTitle = handle
    ? handle.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : 'Collection';

  useEffect(() => {
    // The literal editor route pattern has no collection to load.
    if (!handle || handle === '[handle]') {
      setLoading(false);
      setError(
        'Open a collection page and add /editor to preview it, or pick a collection above.'
      );
      return;
    }
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const page = await getCollectionProductsPage(handle, {
          first: PAGE_SIZE,
          sortKey: sort.sortKey,
          reverse: sort.reverse,
          filterInputs: activeFilters,
        });

        if (cancelled) return;

        if (!page.collection) {
          setError('Collection not found');
          return;
        }

        setTitle(page.collection.title);
        setProducts(page.products);
        setCursor(page.endCursor);
        setHasNextPage(page.hasNextPage);
        // Do not remove active facet choices as result counts change.
        if (activeFilters.length === 0) setFilters(page.filters);
      } catch (err) {
        if (cancelled) return;
        console.error('Error fetching collection products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load collection');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [handle, sort.sortKey, sort.reverse, activeKey]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasNextPage) return;

    try {
      setLoadingMore(true);
      const page = await getCollectionProductsPage(handle, {
        first: PAGE_SIZE,
        after: cursor,
        sortKey: sort.sortKey,
        reverse: sort.reverse,
        filterInputs: activeFilters,
      });

      setProducts((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...page.products.filter((p) => !seen.has(p.id))];
      });
      setCursor(page.endCursor);
      setHasNextPage(page.hasNextPage);
    } catch (err) {
      console.error('Failed to load more products:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <section className="bg-background py-10">
      <div className="max-w-screen-2xl mx-auto px-8">
        <h1 className="text-3xl md:text-4xl font-normal text-foreground">
          {titleProp || title || formattedTitle}
        </h1>

        <div className="mt-6">
          <ProductToolbar
            totalCount={products.length > 0 ? products.length : null}
            onOpenFilters={() => setFiltersOpen(true)}
            sortOptions={SORT_OPTIONS}
            sortIndex={sortIndex}
            onSortChange={setSortIndex}
            activeFilterCount={activeFilters.length}
          />
        </div>

        <div className="mt-8">
          {loading ? (
            <div className={GRID_CLASSES}>
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-square bg-zinc-100"></div>
                  <div className="pt-4 space-y-2">
                    <div className="h-4 w-4/5 bg-zinc-200"></div>
                    <div className="h-4 w-1/4 bg-zinc-200"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-sm text-muted-foreground">{error}</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {activeFilters.length > 0
                ? 'No products matched your filters.'
                : "This collection doesn't have any products yet."}
            </p>
          ) : (
            <>
              <div className={GRID_CLASSES}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {hasNextPage && (
                <div className="mt-16 flex justify-center">
                  <Button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    variant="outline"
                    size="lg"
                    className="font-normal text-muted-foreground hover:text-foreground"
                  >
                    {loadingMore && <Loader size={16} />}
                    {loadingMore ? 'Loading' : 'Load more'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ProductFilters
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filters={filters}
        activeFilters={activeFilters}
        onActiveFiltersChange={setActiveFilters}
      />
    </section>
  );
};

export default CollectionDetail;
