'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProduct, type Product } from '@/hooks/use-shopify-products';
import { useRouteSegment } from '@/hooks/use-route-segment';
import { useShopifyCart } from '@/hooks/use-shopify-cart';
import ProductDetailGallery from './product-detail-gallery';
import ProductDetailInfo from './product-detail-info';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface ProductVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  image?: {
    url: string;
    altText?: string;
  };
}

export type { Product };

interface ProductDetailProps {
  handle?: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ handle: handleProp }) => {
  const routeHandle = useRouteSegment();
  const handle = handleProp || routeHandle || '';
  const { addItem, openCart } = useShopifyCart();

  const { product, loading, error } = useProduct(handle);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  // Initialize variant when product loads
  useEffect(() => {
    if (product) {
      const firstVariant = product.variants.edges[0]?.node;
      if (firstVariant) {
        setSelectedVariant(firstVariant);

        const initialOptions: Record<string, string> = {};
        firstVariant.selectedOptions.forEach((option: { name: string; value: string }) => {
          initialOptions[option.name] = option.value;
        });
        setSelectedOptions(initialOptions);
      }
    }
  }, [product]);

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);

    // Find matching variant
    const matchingVariant = product?.variants.edges.find(({ node }) => {
      return node.selectedOptions.every(option =>
        newOptions[option.name] === option.value
      );
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant.node);

      // Update image if variant has an associated image
      if (matchingVariant.node.image && product) {
        const variantImageUrl = matchingVariant.node.image.url;
        const imageIndex = product.images.edges.findIndex(
          edge => edge.node.url === variantImageUrl
        );
        if (imageIndex !== -1) {
          setSelectedImageIndex(imageIndex);
        }
      }
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || !product) return;

    try {
      setAddingToCart(true);
      await addItem(selectedVariant.id, quantity);
      openCart();
    } catch (err) {
      console.error('Failed to add item to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading || !handle || !product) {
    if (error && handle && !loading) {
      return (
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto flex max-w-md flex-col items-start gap-3 rounded-lg border border-border bg-foreground/[0.02] p-6">
            <p className="text-sm font-medium">Product not found</p>
            <p className="font-mono text-xs leading-relaxed text-muted-foreground line-clamp-3">
              {error}
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Go back
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Skeleton className="aspect-square w-full mb-4" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/shop">Shop</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductDetailGallery
            images={product.images.edges.map(edge => edge.node)}
            selectedImageIndex={selectedImageIndex}
            onImageSelect={setSelectedImageIndex}
          />
          <ProductDetailInfo
            product={product}
            selectedVariant={selectedVariant}
            selectedOptions={selectedOptions}
            quantity={quantity}
            setQuantity={setQuantity}
            handleAddToCart={handleAddToCart}
            onOptionChange={handleOptionChange}
            loading={addingToCart}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
