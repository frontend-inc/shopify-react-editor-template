'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useProduct, type Product } from '@/hooks/use-shopify-products';
import { useShopifyCart, redirectToCheckout } from '@/hooks/use-shopify-cart';
import ProductDetailGallery from './product-detail-gallery';
import ProductDetailInfo from './product-detail-info';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty';

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
    altText?: string | null;
  } | null;
}

export type { Product };

interface ProductDetailProps {
  handle?: string;
  addToCartLabel?: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  handle: handleProp,
  addToCartLabel = 'Add to Cart',
}) => {
  const params = useParams();
  const handle = handleProp || (params?.handle as string);
  const { addItem, openCart, checkoutUrl } = useShopifyCart();

  const { product, loading, error } = useProduct(handle);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  useEffect(() => {
    if (product) {
      const firstVariant = product.variants.edges[0]?.node;
      if (firstVariant) {
        setSelectedVariant(firstVariant);

        const initialOptions: Record<string, string> = {};
        firstVariant.selectedOptions.forEach(
          (option: { name: string; value: string }) => {
            initialOptions[option.name] = option.value;
          }
        );
        setSelectedOptions(initialOptions);
      }
    }
  }, [product]);

  // Unselected options act as wildcards when checking variant availability.
  const isOptionValueAvailable = (optionName: string, value: string) => {
    const variants = product?.variants.edges ?? [];
    if (variants.length === 0) return true;

    return variants.some(({ node }) => {
      if (!node.availableForSale) return false;

      return node.selectedOptions.every((option) => {
        if (option.name === optionName) return option.value === value;
        const selected = selectedOptions[option.name];
        return selected === undefined || selected === option.value;
      });
    });
  };

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);

    const matchingVariant = product?.variants.edges.find(({ node }) => {
      return node.selectedOptions.every(
        (option) => newOptions[option.name] === option.value
      );
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant.node);
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

  const handleBuyNow = async () => {
    if (!selectedVariant || !product) return;

    try {
      setBuyingNow(true);
      const updatedCart = await addItem(selectedVariant.id, quantity);
      const url = updatedCart?.checkoutUrl ?? checkoutUrl;

      if (url) {
        redirectToCheckout(url);
      } else {
        openCart();
      }
    } catch (err) {
      console.error('Failed to start checkout:', err);
    } finally {
      setBuyingNow(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-zinc-100 animate-pulse"
              ></div>
            ))}
          </div>

          <div className="lg:col-span-2 animate-pulse">
            <div className="h-8 bg-zinc-100 w-2/3"></div>
            <div className="h-5 bg-zinc-100 w-24 mt-2"></div>
            <div className="h-8 bg-zinc-100 w-32 mt-8"></div>
            <div className="h-10 bg-zinc-100 mt-8"></div>
            <div className="h-12 bg-zinc-100 mt-8"></div>
            <div className="h-12 bg-zinc-100 mt-3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Empty className="min-h-[400px]">
          <EmptyHeader>
            <EmptyTitle>Product Not Found</EmptyTitle>
            <EmptyDescription>
              {error || 'The requested product could not be found.'}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => window.history.back()} variant="outline">
              Go Back
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="max-w-screen-2xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-3">
            <ProductDetailGallery
              images={product.images.edges.map((edge) => edge.node)}
            />
          </div>
          <div className="lg:col-span-2 lg:sticky lg:top-20">
            <ProductDetailInfo
              product={product}
              selectedVariant={selectedVariant}
              selectedOptions={selectedOptions}
              quantity={quantity}
              setQuantity={setQuantity}
              handleAddToCart={handleAddToCart}
              handleBuyNow={handleBuyNow}
              onOptionChange={handleOptionChange}
              isOptionValueAvailable={isOptionValueAvailable}
              loading={addingToCart}
              buyingNow={buyingNow}
              addToCartLabel={addToCartLabel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
