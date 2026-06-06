import type { ShopifyProduct } from "@reacteditor/field-shopify";
import {
  useProduct,
  useProductRecommendations,
} from "@/hooks/use-shopify-products";
import { ProductCard } from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/Heading";

export type RecommendedProductsProps = {
  product: ShopifyProduct | null;
  tagline: string;
  heading: string;
  limit: number;
};

export function RecommendedProductsView({
  product: selected,
  tagline,
  heading,
  limit,
}: RecommendedProductsProps) {
  const { product } = useProduct(selected?.handle ?? null);
  const { recommendations } = useProductRecommendations(product?.id ?? null);
  const items = (recommendations ?? []).slice(0, limit);

  if (!selected) {
    return (
      <section className="bg-background py-20 md:py-28">
        <Container>
          <div className="mb-12 flex max-w-xl flex-col gap-3">
            {tagline ? <Skeleton className="h-3 w-24" /> : null}
            <Skeleton className="h-8 w-2/3" />
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
            {Array.from({ length: limit }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] w-full" />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-background py-20 md:py-28">
      <Container>
        <Heading
          tagline={tagline}
          title={heading}
          align="left"
          size="md"
          className="mb-12"
          maxWidth="max-w-xl"
        />

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {items.length === 0
            ? Array.from({ length: limit }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] w-full" />
              ))
            : items.map((p: any) => <ProductCard key={p.id} product={p} />)}
        </div>
      </Container>
    </section>
  );
}
