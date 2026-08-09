'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { RiSearchLine, RiImageLine, RiCloseLine } from '@remixicon/react';
import {
  searchSuggestions,
  type SearchSuggestion,
} from '@/hooks/use-shopify-search';

const DEBOUNCE_MS = 250;
const SUGGESTION_COUNT = 3;

const formatPrice = (amount: string) => `$${parseFloat(amount).toFixed(2)}`;

const SearchDialog: React.FC = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [results, setResults] = useState<SearchSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  // Guards against a slow early request overwriting a newer one's results.
  const requestId = useRef(0);

  useEffect(() => {
    const query = term.trim();

    if (!query) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const id = ++requestId.current;

    const timer = setTimeout(async () => {
      try {
        const { products } = await searchSuggestions(query, SUGGESTION_COUNT);
        if (id !== requestId.current) return;
        setResults(products);
      } catch (err) {
        console.error('Search failed:', err);
        if (id === requestId.current) setResults([]);
      } finally {
        if (id === requestId.current) setSearching(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [term]);

  const close = () => {
    setOpen(false);
    setTerm('');
    setResults([]);
  };

  const goToSearchPage = () => {
    const query = term.trim();
    close();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : '/search');
  };

  const goToProduct = (handle: string) => {
    close();
    router.push(`/products/${handle}`);
  };

  const hasQuery = Boolean(term.trim());

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        size="icon"
        aria-label="Search"
        className="rounded-full"
      >
        <RiSearchLine className="size-5" />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={(next) => !next && close()}
        title="Search"
        description="Search products"
        showCloseButton={false}
        className="top-24 max-w-xl translate-y-0"
        // Results come from the Storefront API, so cmdk must not re-filter them.
        shouldFilter={false}
      >
        <div className="relative">
          <CommandInput
            value={term}
            onValueChange={setTerm}
            placeholder="Search products"
            className="pr-28"
            onKeyDown={(event) => {
              if (event.key === 'Enter') goToSearchPage();
            }}
          />
          <div className="absolute right-2 top-0 flex h-12 items-center gap-1">
            {hasQuery && (
              <Button
                onClick={() => setTerm('')}
                variant="ghost"
                size="sm"
                className="font-normal text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            )}
            <Button
              onClick={close}
              variant="ghost"
              size="icon-sm"
              aria-label="Close search"
            >
              <RiCloseLine className="size-4" />
            </Button>
          </div>
        </div>

        {hasQuery && (
          <>
            <div className="px-3 pt-3">
              <button
                onClick={goToSearchPage}
                className="rounded-full border border-border px-3 py-1 text-sm text-foreground transition-colors hover:border-foreground"
              >
                {term.trim()}
              </button>
            </div>

            <CommandList className="max-h-80">
              {searching && results.length === 0 ? (
                <div className="flex justify-center py-8">
                  <Loader size={20} />
                </div>
              ) : results.length === 0 ? (
                <CommandEmpty>No products found.</CommandEmpty>
              ) : (
                <CommandGroup heading="Products">
                  {results.map((product) => (
                    <CommandItem
                      key={product.id}
                      value={product.handle}
                      onSelect={() => goToProduct(product.handle)}
                      className="gap-3 py-2"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden bg-zinc-100">
                        {product.featuredImage ? (
                          <Image
                            src={product.featuredImage.url}
                            alt={product.featuredImage.altText || product.title}
                            width={56}
                            height={56}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-zinc-400">
                            <RiImageLine className="size-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-foreground">
                          {product.title}
                        </div>
                        <div className="font-mono text-sm tabular-nums tracking-tight text-foreground">
                          {formatPrice(
                            product.priceRange.minVariantPrice.amount
                          )}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>

            {results.length > 0 && (
              <div className="flex justify-center px-4 pb-5 pt-2">
                <Button onClick={goToSearchPage} className="px-8">
                  View All
                </Button>
              </div>
            )}
          </>
        )}
      </CommandDialog>
    </>
  );
};

export default SearchDialog;
