import { useEffect, useState } from "react";
import { useRouteSegment } from "@/hooks/use-route-segment";
import type { ShopifyProduct } from "@reacteditor/field-shopify";
import { useProduct } from "@/hooks/use-shopify-products";
import { useShopifyCart } from "@/hooks/use-shopify-cart";
import { Typography } from "@/components/Typography";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "@/components/ui/loader";
import { Container } from "@/components/layout/Container";

export type ProductDetailsProps = {
  product: ShopifyProduct | null;
};

export function ProductDetailsView({ product: selected }: ProductDetailsProps) {
  const routeHandle = useRouteSegment();
  const handle = selected?.handle ?? routeHandle ?? null;
  const { product, loading } = useProduct(handle);
  const cart = useShopifyCart();
  const [activeImage, setActiveImage] = useState(0);
  const [variant, setVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (product?.variants?.edges?.length) {
      setVariant(product.variants.edges[0].node);
    }
  }, [product]);

  if (!handle || loading || !product) {
    return (
      <section className="bg-background py-12 md:py-20">
        <Container className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col gap-4">
            <Skeleton className="aspect-[4/5] w-full" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-20 flex-shrink-0" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <div className="flex flex-col gap-3">
              <Skeleton className="h-3 w-16" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-16 rounded-md" />
                <Skeleton className="h-10 w-16 rounded-md" />
                <Skeleton className="h-10 w-16 rounded-md" />
              </div>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <Skeleton className="h-11 w-32 rounded-md" />
              <Skeleton className="h-11 flex-1 rounded-md" />
            </div>
            <div className="space-y-2 border-t border-border pt-6">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </Container>
      </section>
    );
  }

  const images = product.images?.edges?.map((e: any) => e.node) ?? [];
  const main = images[activeImage];
  const price = variant?.price ?? product.priceRange?.minVariantPrice;
  const formatted = price
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: price.currencyCode,
      }).format(parseFloat(price.amount))
    : null;

  const onAdd = async () => {
    if (!variant) return;
    setAdding(true);
    try {
      await cart.addItem(variant.id, quantity);
      cart.openCart();
    } finally {
      setAdding(false);
    }
  };

  return (
    <section className="bg-background py-12 md:py-20">
      <Container className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col gap-4">
          <div className="aspect-[4/5] w-full overflow-hidden rounded-md bg-muted">
            {main ? (
              <img
                src={main.url}
                alt={main.altText || product.title}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          {images.length > 1 ? (
            <div className="flex gap-3 overflow-x-auto p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {images.map((img: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "aspect-square w-20 flex-shrink-0 overflow-hidden rounded-md transition-opacity",
                    i === activeImage
                      ? "ring-2 ring-foreground"
                      : "opacity-60 hover:opacity-100",
                  )}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <Typography variant="h2" as="h1">
              {product.title}
            </Typography>
            {formatted ? (
              <Typography variant="subtitle1" className="mt-3 text-foreground">
                {formatted}
              </Typography>
            ) : null}
          </div>

          {(product.options ?? []).map((opt: any) => (
            <div key={opt.id ?? opt.name}>
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {opt.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {opt.values.map((val: string) => {
                  const matching = product.variants.edges.find((e: any) =>
                    e.node.selectedOptions?.some(
                      (o: any) => o.name === opt.name && o.value === val,
                    ),
                  );
                  const selected = variant?.selectedOptions?.some(
                    (o: any) => o.name === opt.name && o.value === val,
                  );
                  return (
                    <button
                      key={val}
                      onClick={() => matching && setVariant(matching.node)}
                      className={cn(
                        "min-w-12 rounded-md border px-4 py-2 text-sm transition-colors",
                        selected
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground",
                      )}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-3 rounded-md border border-border px-4 py-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="text-base hover:opacity-60"
              >
                −
              </button>
              <span className="w-6 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="text-base hover:opacity-60"
              >
                +
              </button>
            </div>
            <button
              onClick={onAdd}
              disabled={!variant || adding}
              className="flex-1 rounded-md bg-foreground px-6 py-3 text-sm font-medium tracking-wide text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {adding ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader size={16} />
                  Adding…
                </span>
              ) : (
                "Add to bag"
              )}
            </button>
          </div>

          {product.description ? (
            <div className="border-t border-border pt-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Details
              </p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                {product.description}
              </p>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
