'use client';

import React from 'react';
import type { ShopifyProduct } from '@reacteditor/field-shopify';
import {
  useProduct,
  useProductRecommendations,
} from '@/hooks/use-shopify-products';
import { useRouteSegment } from '@/hooks/use-route-segment';
import { ProductCard } from './product-card';

export type ProductRecommendationsProps = {
  product: ShopifyProduct | null;
  heading: string;
  limit: number;
};

export function ProductRecommendationsView({
  product: selected,
  heading,
  limit,
}: ProductRecommendationsProps) {
  const routeHandle = useRouteSegment();
  const handle = selected?.handle ?? routeHandle ?? null;
  const { product } = useProduct(handle);
  const { recommendations, loading, error } = useProductRecommendations(
    product?.id ?? null,
  );

  // Don't show section if we're not loading and have no recommendations
  if (!loading && (!recommendations || recommendations.length === 0)) {
    return null;
  }

  return (
    <div className="bg-muted py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-foreground font-heading">
          {heading}
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: limit }).map((_, index) => (
              <div key={index} className="bg-card rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted"></div>
                <div className="p-6">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-8 bg-muted rounded mb-4"></div>
                  <div className="h-12 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Recommendations could not be loaded</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {recommendations.slice(0, limit).map((recommendedProduct) => (
              <ProductCard
                key={recommendedProduct.id}
                product={recommendedProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductRecommendationsView;
