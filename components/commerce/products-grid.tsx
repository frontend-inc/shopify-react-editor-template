import { useEffect, useState } from "react";
import Link from "next/link";
import type { ShopifyCollection } from "@reacteditor/field-shopify";
import { getProducts } from "@/hooks/use-shopify-products";
import { getCollectionProducts } from "@/hooks/use-shopify-collections";
import { ProductCard } from "./product-card";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/Heading";

export type ProductsGridProps = {
  collection: ShopifyCollection | null;
  tagline: string;
  heading: string;
  subheading: string;
  columns: "3" | "4";
  limit: number;
  ctaLabel: string;
  ctaHref: string;
};

const colClass: Record<ProductsGridProps["columns"], string> = {
  "3": "grid-cols-2 md:grid-cols-3",
  "4": "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

export function ProductsGrid({
  collection,
  tagline,
  heading,
  subheading,
  columns,
  limit,
  ctaLabel,
  ctaHref,
}: ProductsGridProps) {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        if (collection?.handle) {
          const data = await getCollectionProducts(collection.handle, {
            first: limit,
          });
          if (!cancelled) setProducts(data?.collection?.products ?? []);
        } else {
          const data = await getProducts({ first: limit, sortKey: "BEST_SELLING" });
          if (!cancelled) setProducts(data ?? []);
        }
      } catch {
        if (!cancelled) setProducts([]);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [collection?.handle, limit]);

  return (
    <section className="bg-background py-20 md:py-28">
      <Container>
        <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row md:items-end">
          <Heading
            tagline={tagline}
            title={heading}
            subtitle={subheading}
            align="left"
            size="lg"
            maxWidth="max-w-xl"
          />
          {ctaLabel ? (
            <Link
              href={ctaHref || (collection?.handle ? `/collections/${collection.handle}` : "/collections")}
              className="text-sm font-medium tracking-wide hover:opacity-70"
            >
              {ctaLabel} →
            </Link>
          ) : null}
        </div>

        <div className={`grid gap-x-6 gap-y-12 ${colClass[columns]}`}>
          {products.length === 0
            ? Array.from({ length: limit }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] w-full animate-pulse rounded-md bg-muted"
                />
              ))
            : products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </Container>
    </section>
  );
}
