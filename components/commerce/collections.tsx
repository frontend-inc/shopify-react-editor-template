'use client';

import React from 'react';
import { useCollections } from '@/hooks/use-shopify-collections';
import CollectionCard from './collection-card';

const Collections: React.FC = () => {
  const { collections, loading, error, refetch } = useCollections(20);

  if (loading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 text-foreground font-heading">
            Our Collections
          </h2>

          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-card rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted"></div>
                <div className="p-6">
                  <div className="h-8 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex max-w-md flex-col items-start gap-3 rounded-lg border border-border bg-foreground/[0.02] p-6">
            <p className="text-sm font-medium">Could not load collections</p>
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

  if (collections.length === 0) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-8 font-heading">
            Our Collections
          </h2>

          <div className="bg-muted border border-border rounded-lg p-8 max-w-md mx-auto">
            <i className="ri-folder-line text-4xl text-muted-foreground mb-4"></i>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Collections Found
            </h3>
            <p className="text-muted-foreground">
              Check back later or configure your Shopify store connection.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16 text-foreground font-heading">
          Our Collections
        </h2>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;
