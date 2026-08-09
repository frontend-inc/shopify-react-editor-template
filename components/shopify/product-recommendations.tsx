'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import {
  useProduct,
  useProductRecommendations,
} from '@/hooks/use-shopify-products';
import ProductCard from './product-card';

interface ProductRecommendationsProps {
  productId?: string;
  /**
   * Seeds recommendations from a specific product. Left empty, it reads the
   * `[handle]` segment, which is what the `/products/[handle]` template does.
   */
  handle?: string;
  title?: string;
  limit?: number;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  productId: productIdProp,
  handle: handleProp,
  title = 'You May Also Like',
  limit = 4,
}) => {
  const params = useParams();
  const handle = handleProp || (params?.handle as string | undefined);
  const { product } = useProduct(productIdProp ? null : (handle ?? null));
  const resolvedProductId = productIdProp || product?.id || '';

  const { recommendations, loading, error } = useProductRecommendations(
    resolvedProductId || null
  );

  if (!loading && (!recommendations || recommendations.length === 0)) {
    return null;
  }

  return (
    <section className="bg-background py-16">
      <div className="max-w-screen-2xl mx-auto px-8">
        <h2 className="text-2xl md:text-3xl font-normal text-foreground mb-8">
          {title}
        </h2>

        {error ? (
          <p className="text-sm text-muted-foreground">
            Recommendations could not be loaded
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {loading
              ? Array.from({ length: limit }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-square bg-zinc-100"></div>
                    <div className="pt-4 space-y-2">
                      <div className="h-4 bg-zinc-200 w-4/5"></div>
                      <div className="h-4 bg-zinc-200 w-1/4"></div>
                    </div>
                  </div>
                ))
              : recommendations
                  .slice(0, limit)
                  .map((recommendedProduct) => (
                    <ProductCard
                      key={recommendedProduct.id}
                      product={recommendedProduct}
                    />
                  ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductRecommendations;
