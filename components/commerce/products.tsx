'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from './product-card';
import { getProducts } from '@/hooks/use-shopify-products';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface ProductImage {
  url: string;
  altText?: string;
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
  limit?: number;
  showLoadMore?: boolean;
}

const Products: React.FC<ProductsProps> = ({ 
  title = "Our Products", 
  limit = 12,
  showLoadMore = true 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);

  const fetchProducts = async (currentProducts: Product[] = [], loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      const newProducts = await getProducts({ 
        first: limit,
        sortKey: 'CREATED_AT',
        reverse: true
      });

      if (loadMore) {
        // Filter out products that already exist
        const existingIds = new Set(currentProducts.map(p => p.id));
        const uniqueNewProducts = newProducts.filter(p => !existingIds.has(p.id));
        
        if (uniqueNewProducts.length === 0) {
          setHasMoreProducts(false);
        } else {
          setProducts(prev => [...prev, ...uniqueNewProducts]);
        }
      } else {
        setProducts(newProducts);
        setHasMoreProducts(newProducts.length === limit);
      }
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
  }, [limit]);

  const handleAddToCart = async (product: Product) => {
    // Here you would typically integrate with cart functionality
    console.log('Adding to cart:', product);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMoreProducts) {
      fetchProducts(products, true);
    }
  };

  if (loading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 font-heading">
            {title}
          </h2>
          
          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
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
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex max-w-md flex-col items-start gap-3 rounded-lg border border-border bg-foreground/[0.02] p-6">
            <p className="text-sm font-medium">Could not load products</p>
            <p className="font-mono text-xs leading-relaxed text-muted-foreground line-clamp-3">
              {error}
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fetchProducts()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 font-heading">
            {title}
          </h2>
          
          <div className="bg-muted border border-border rounded-lg p-8 max-w-md mx-auto">
            <i className="ri-shopping-bag-line text-4xl text-muted-foreground mb-4"></i>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Products Found
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
          {title}
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* Load More Button */}
        {showLoadMore && hasMoreProducts && (
          <div className="text-center">
            <Button
              onClick={handleLoadMore}
              disabled={loadingMore}
              size="lg"
              className="font-heading"
            >
              {loadingMore ? (
                <span className="flex items-center space-x-2">
                  <Spinner size="sm" />
                  <span>Loading...</span>
                </span>
              ) : (
                'Load More Products'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;