'use client';

import React from 'react';
import { useCollectionProducts } from '@/hooks/use-shopify-collections';
import ProductCard from './product-card';
import { Skeleton } from '@/components/ui/skeleton';

const CollectionDetail: React.FC<{ handle?: string }> = ({ handle: handleProp }) => {
  const handle = handleProp ?? '';

  const { collection, loading, error, refetch } = useCollectionProducts(handle);

  // Format title from handle
  const formattedTitle = handle
    ? handle.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Collection';

  if (loading || !handle) {
    return (
      <div className="pt-4 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-16 flex justify-center">
            <Skeleton className="h-12 w-64" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-3">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-4 pb-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex max-w-md flex-col items-start gap-3 rounded-lg border border-border bg-foreground/[0.02] p-6">
            <p className="text-sm font-medium">Could not load collection</p>
            <p className="font-mono text-xs leading-relaxed text-muted-foreground line-clamp-3">
              {error}
            </p>
            <button
              onClick={() => refetch()}
              className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const products = collection?.products || [];
  const title = collection?.title || formattedTitle;

  return (
    <div className="pt-4 pb-16">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16 text-foreground font-heading">
          {title}
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-muted border border-border rounded-lg p-8 max-w-md mx-auto">
              <i className="ri-shopping-bag-line text-4xl text-muted-foreground mb-4"></i>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Products in Collection
              </h3>
              <p className="text-muted-foreground">
                This collection doesn&apos;t have any products yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetail;
