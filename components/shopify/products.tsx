'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from './product-card';
import { getProductsPage } from '@/hooks/use-shopify-products';
import { getCollectionProductsPage } from '@/hooks/use-shopify-collections';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';

interface ProductImage {
  url: string;
  altText?: string | null;
}

interface ProductPrice {
  amount: string;
  currencyCode: string;
}

interface ProductVariant {
  id: string;
  title: string;
  price: ProductPrice;
  availableForSale: boolean;
}

interface Product {
  id: string;
  title: string;
  description?: string;
  handle: string;
  images: {
    edges: Array<{
      node: ProductImage;
    }>;
  };
  priceRange: {
    minVariantPrice: ProductPrice;
  };
  compareAtPriceRange?: {
    minVariantPrice: ProductPrice;
  };
  variants: {
    edges: Array<{
      node: ProductVariant;
    }>;
  };
}

interface ProductsProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  showLoadMore?: boolean;
  /**
   * Narrows the grid to one collection. Empty shows the newest products across
   * the whole catalogue, which is what the home page does.
   */
  collectionHandle?: string;
}

const Products: React.FC<ProductsProps> = ({
  title = 'Shopify Hydrogen Storefront',
  subtitle = 'An agent-friendly Shopify storefront built with Next.js and Hydrogen.',
  limit = 12,
  showLoadMore = true,
  collectionHandle,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);

  // Paging is cursor-based: without `after`, Shopify returns the same first
  // page every time and "load more" appends nothing.
  const fetchProducts = async (loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      // A pinned collection uses the collection query so its own ordering
      // applies; otherwise fall back to newest-first across the catalogue.
      const page = collectionHandle
        ? await getCollectionProductsPage(collectionHandle, {
            first: limit,
            after: loadMore ? cursor : null,
          })
        : await getProductsPage({
            first: limit,
            after: loadMore ? cursor : null,
            sortKey: 'CREATED_AT',
            reverse: true,
          });

      setProducts((prev) => {
        if (!loadMore) return page.products;

        const existingIds = new Set(prev.map((p) => p.id));
        return [
          ...prev,
          ...page.products.filter((p) => !existingIds.has(p.id)),
        ];
      });

      setCursor(page.endCursor);
      setHasMoreProducts(page.hasNextPage);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [limit, collectionHandle]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMoreProducts) {
      fetchProducts(true);
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <div className="max-w-screen-2xl mx-auto px-8">
          <h2 className="text-center text-2xl md:text-3xl font-normal max-w-3xl mx-auto text-foreground">
            {title}
          </h2>
          <p className="text-center text-sm font-normal max-w-xl mx-auto text-muted-foreground mt-2.5 mb-16">
            {subtitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-zinc-100"></div>
                <div className="pt-4 space-y-2">
                  <div className="h-4 bg-zinc-200 w-4/5"></div>
                  <div className="h-4 bg-zinc-200 w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="py-20 bg-background">
        <div className="max-w-screen-2xl mx-auto px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-normal max-w-3xl mx-auto text-foreground">
            {title}
          </h2>
          <p className="text-sm font-normal max-w-xl mx-auto text-muted-foreground mt-2.5 mb-12">
            {subtitle}
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            {error ||
              'Our curated collection is being prepared. Please check back shortly.'}
          </p>
          {error && (
            <Button
              onClick={() => fetchProducts()}
              variant="outline"
              size="lg"
              className="font-normal text-muted-foreground hover:text-foreground"
            >
              Try again
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="max-w-screen-2xl mx-auto px-8">
        <h2 className="text-center text-2xl md:text-3xl font-normal max-w-3xl mx-auto text-foreground">
          {title}
        </h2>
        <p className="text-center text-sm font-normal max-w-xl mx-auto text-muted-foreground mt-2.5 mb-16">
          {subtitle}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 mb-20">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {showLoadMore && hasMoreProducts && (
          <div className="flex justify-center">
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
      </div>
    </div>
  );
};

export default Products;
