import * as React from "react";
import Link from "next/link";
import { Typography } from "@/components/Typography";

type ProductImage = { url: string; altText?: string };
type ProductPrice = { amount: string; currencyCode: string };

export type ProductCardData = {
  id: string;
  handle: string;
  title: string;
  images?: { edges?: Array<{ node: ProductImage }> };
  priceRange?: { minVariantPrice?: ProductPrice };
  compareAtPriceRange?: { minVariantPrice?: ProductPrice };
};

function format(price: ProductPrice) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currencyCode,
  }).format(parseFloat(price.amount));
}

export function ProductCard({
  product,
  aspect = "portrait",
}: {
  product: ProductCardData;
  aspect?: "portrait" | "square" | "landscape";
}) {
  const image = product.images?.edges?.[0]?.node;
  const price = product.priceRange?.minVariantPrice;
  const compare = product.compareAtPriceRange?.minVariantPrice;
  const onSale =
    price && compare && parseFloat(compare.amount) > parseFloat(price.amount);

  const aspectClass: Record<string, string> = {
    portrait: "aspect-[4/5]",
    square: "aspect-square",
    landscape: "aspect-[4/3]",
  };

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div
        className={`relative w-full overflow-hidden rounded-md bg-muted ${aspectClass[aspect]}`}
      >
        {image ? (
          <img
            src={image.url}
            alt={image.altText || product.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <Typography
          variant="subtitle2"
          className="font-medium tracking-tight text-foreground"
        >
          {product.title}
        </Typography>
        {price ? (
          <div className="flex flex-col items-end text-sm">
            {onSale && compare ? (
              <span className="text-xs text-muted-foreground line-through">
                {format(compare)}
              </span>
            ) : null}
            <span className="font-medium">{format(price)}</span>
          </div>
        ) : null}
      </div>
    </Link>
  );
}

export default ProductCard;
