'use client';

import React from 'react';
import { useCollections } from '@/hooks/use-shopify-collections';
import CollectionCard from './collection-card';
import { Button } from '@/components/ui/button';

interface CollectionsProps {
  title?: string;
  subtitle?: string;
}

const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <>
    <h2 className="text-center text-2xl md:text-3xl font-normal max-w-3xl mx-auto text-foreground">
      {title}
    </h2>
    {subtitle && (
      <p className="text-center text-sm font-normal max-w-xl mx-auto text-muted-foreground mt-2.5 mb-16">
        {subtitle}
      </p>
    )}
  </>
);

const GRID_CLASSES = 'grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12';

const Collections: React.FC<CollectionsProps> = ({
  title = 'Our Collections',
  subtitle = 'Discover our carefully crafted worlds',
}) => {
  const { collections, loading, error, refetch } = useCollections(12);

  if (loading) {
    return (
      <div className="py-20 bg-background">
        <div className="max-w-screen-2xl mx-auto px-8">
          <SectionHeader title={title} subtitle={subtitle} />

          <div className={GRID_CLASSES}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-zinc-100"></div>
                <div className="pt-4">
                  <div className="h-4 bg-zinc-200 w-3/5"></div>
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
      <div className="py-20 bg-background">
        <div className="max-w-screen-2xl mx-auto px-8 text-center">
          <SectionHeader title={title} subtitle={subtitle} />
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <Button onClick={refetch} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="py-20 bg-background">
        <div className="max-w-screen-2xl mx-auto px-8 text-center">
          <SectionHeader title={title} subtitle={subtitle} />
          <p className="text-sm text-muted-foreground">
            Collections will appear here once added to your Shopify store.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-background">
      <div className="max-w-screen-2xl mx-auto px-8">
        <SectionHeader title={title} subtitle={subtitle} />

        <div className={GRID_CLASSES}>
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;
