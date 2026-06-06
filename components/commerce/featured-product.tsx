import Link from "next/link";
import type { ShopifyProduct } from "@reacteditor/field-shopify";
import { useProduct } from "@/hooks/use-shopify-products";
import { useShopifyCart } from "@/hooks/use-shopify-cart";
import { Typography } from "@/components/Typography";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

export type FeaturedProductProps = {
  product: ShopifyProduct | null;
  tagline: string;
  ctaLabel: string;
  align: "left" | "right";
  tone: "default" | "muted";
};

export function FeaturedProductView({
  product: selected,
  tagline,
  ctaLabel,
  align,
  tone,
}: FeaturedProductProps) {
  const { product: full, loading } = useProduct(selected?.handle ?? null);
  const product: any = full ?? selected;
  const cart = useShopifyCart();

  if (!product) {
    return (
      <section
        className={cn(
          "py-20 md:py-28",
          tone === "muted" ? "bg-muted/40" : "bg-background",
        )}
      >
        <Container className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className={cn(align === "right" && "md:order-2")}>
            <Skeleton className="aspect-[4/5] w-full" />
          </div>
          <div className="flex w-full flex-col items-start gap-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <div className="w-full max-w-md space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            <div className="mt-2 flex flex-wrap gap-3">
              <Skeleton className="h-11 w-32 rounded-md" />
              <Skeleton className="h-11 w-32 rounded-md" />
            </div>
          </div>
        </Container>
      </section>
    );
  }

  const image =
    product.images?.edges?.[0]?.node ?? (selected as any)?.featuredImage ?? null;
  const variant = product.variants?.edges?.[0]?.node;
  const price = product.priceRange?.minVariantPrice;
  const formatted = price
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: price.currencyCode,
      }).format(parseFloat(price.amount))
    : null;

  return (
    <section
      className={
        tone === "muted"
          ? "bg-muted/40 py-20 md:py-28"
          : "bg-background py-20 md:py-28"
      }
    >
      <Container className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className={align === "right" ? "md:order-2" : ""}>
          {image ? (
            <img
              src={image.url}
              alt={image.altText || product.title}
              className="aspect-[4/5] w-full rounded-md object-cover"
            />
          ) : (
            <div className="aspect-[4/5] w-full rounded-md bg-muted" />
          )}
        </div>
        <div className="flex flex-col items-start gap-5">
          {tagline ? (
            <Typography variant="caption">{tagline}</Typography>
          ) : null}
          <Typography variant="h2">{product.title}</Typography>
          {formatted ? (
            <Typography variant="subtitle1" className="text-foreground font-medium">
              {formatted}
            </Typography>
          ) : null}
          {product.description ? (
            <Typography variant="body2" className="max-w-md text-muted-foreground">
              {product.description}
            </Typography>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-3">
            <button
              onClick={async () => {
                if (!variant) return;
                await cart.addItem(variant.id, 1);
                cart.openCart();
              }}
              className="inline-flex items-center justify-center rounded-md bg-foreground px-6 py-3 text-sm font-medium tracking-wide text-background hover:opacity-90"
            >
              {ctaLabel}
            </button>
            <Link
              href={`/products/${product.handle}`}
              className="inline-flex items-center justify-center rounded-md border border-foreground px-6 py-3 text-sm font-medium tracking-wide hover:opacity-80"
            >
              View details
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
