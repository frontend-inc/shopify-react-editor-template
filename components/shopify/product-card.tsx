import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { truncate } from '@/lib/utils';

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

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const firstImage = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const hasDiscount =
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  const firstVariant = product.variants.edges[0]?.node;
  const isAvailable = firstVariant?.availableForSale || false;

  const formatPrice = (amount: string) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block h-full"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        {firstImage ? (
          <Image
            src={firstImage.url}
            alt={firstImage.altText || product.title}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-contain transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
            <i className="ri-image-line text-8xl"></i>
          </div>
        )}

        {hasDiscount && compareAtPrice && (
          <span className="absolute top-3 left-3 text-[11px] font-mono tracking-widest text-rose-600">
            SALE
          </span>
        )}

        {!isAvailable && (
          <span className="absolute top-3 right-3 text-[11px] font-mono tracking-widest text-muted-foreground">
            SOLD OUT
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 py-2.5">
        <h3 className="text-sm font-medium text-foreground line-clamp-1">
          {truncate(product.title, 65)}
        </h3>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-mono tabular-nums tracking-tight text-sm text-foreground">
            {formatPrice(price.amount)}
          </span>
          {hasDiscount && compareAtPrice && (
            <span className="font-mono tabular-nums tracking-tight text-sm line-through text-muted-foreground">
              {formatPrice(compareAtPrice.amount)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
