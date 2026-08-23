'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from './product-card';
import ProductFilters from './product-filters';
import ProductToolbar from './product-toolbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import { RiSearchLine, RiCloseLine } from '@remixicon/react';
import {
  searchProducts,
  type SearchFilter,
  type SearchSortKey,
} from '@/hooks/use-shopify-search';
import type { Product } from '@/hooks/use-shopify-products';

const PAGE_SIZE = 24;

interface SortOption {
  label: string;
  sortKey: SearchSortKey;
  reverse: boolean;
}

const SORT_OPTIONS: SortOption[] = [
  { label: 'Best Matches', sortKey: 'RELEVANCE', reverse: false },
  { label: 'Price: Low to High', sortKey: 'PRICE', reverse: false },
  { label: 'Price: High to Low', sortKey: 'PRICE', reverse: true },
];

interface SearchResultsProps {
  title?: string;
  placeholder?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  title = 'Search',
  placeholder = 'Search products',
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [term, setTerm] = useState(query);

  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [sortIndex, setSortIndex] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const sort = SORT_OPTIONS[sortIndex];
  // Stabilize the effect dependency by filter contents.
  const activeKey = useMemo(() => activeFilters.join('|'), [activeFilters]);

  // Keep the field in step with the URL, which also changes from the header
  // search dialog and from back/forward navigation.
  useEffect(() => {
    setTerm(query);
  }, [query]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const next = term.trim();
    if (next === query) return;
    router.push(next ? `/search?q=${encodeURIComponent(next)}` : '/search');
  };

  const clearSearch = () => {
    setTerm('');
    if (query) router.push('/search');
  };

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await searchProducts({
          query,
          first: PAGE_SIZE,
          sortKey: sort.sortKey,
          reverse: sort.reverse,
          filterInputs: activeFilters,
        });

        if (cancelled) return;

        setProducts(result.products);
        setTotalCount(result.totalCount);
        setCursor(result.endCursor);
        setHasNextPage(result.hasNextPage);
        // Do not remove active facet choices as result counts change.
        if (activeFilters.length === 0) setFilters(result.filters);
      } catch (err) {
        if (cancelled) return;
        console.error('Search failed:', err);
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [query, sort.sortKey, sort.reverse, activeKey]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasNextPage) return;

    try {
      setLoadingMore(true);
      const result = await searchProducts({
        query,
        first: PAGE_SIZE,
        after: cursor,
        sortKey: sort.sortKey,
        reverse: sort.reverse,
        filterInputs: activeFilters,
      });

      setProducts((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...result.products.filter((p) => !seen.has(p.id))];
      });
      setCursor(result.endCursor);
      setHasNextPage(result.hasNextPage);
    } catch (err) {
      console.error('Failed to load more results:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <section className="bg-background py-10">
      <div className="max-w-screen-2xl mx-auto px-8">
        <h1 className="text-3xl md:text-4xl font-normal text-foreground">
          {title}
        </h1>

        <form onSubmit={submitSearch} className="mt-6 max-w-xl">
          <div className="relative">
            <RiSearchLine
              size={18}
              className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="text"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder={placeholder}
              aria-label="Search products"
              className="h-11 rounded-none border-0 border-b border-border bg-transparent pl-7 pr-8 shadow-none focus-visible:border-foreground focus-visible:ring-0 dark:bg-transparent"
            />
            {term && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              >
                <RiCloseLine size={18} />
              </button>
            )}
          </div>
        </form>

        <div className="mt-8">
          <ProductToolbar
            totalCount={totalCount}
            onOpenFilters={() => setFiltersOpen(true)}
            sortOptions={SORT_OPTIONS}
            sortIndex={sortIndex}
            onSortChange={setSortIndex}
            activeFilterCount={activeFilters.length}
          />
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12">
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
              No products matched{query ? ` “${query}”` : ' your filters'}.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12">
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

export default SearchResults;
