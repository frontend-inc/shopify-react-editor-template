import { useEffect, useState } from "react";
import Link from "next/link";
import type { ShopifyCollection } from "@reacteditor/field-shopify";
import { getProducts } from "@/hooks/use-shopify-products";
import { getCollectionProducts } from "@/hooks/use-shopify-collections";
import { ProductCard } from "./product-card";
import { Heading } from "@/components/Heading";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Container } from "@/components/layout/Container";

export type ProductsCarouselProps = {
  collection: ShopifyCollection | null;
  tagline: string;
  heading: string;
  subheading: string;
  limit: number;
  slidesPerView: "2" | "3" | "4";
  ctaLabel: string;
  ctaHref: string;
};

const basisClass: Record<ProductsCarouselProps["slidesPerView"], string> = {
  "2": "md:basis-1/2",
  "3": "md:basis-1/3",
  "4": "md:basis-1/4",
};

export function ProductsCarousel({
  collection,
  tagline,
  heading,
  subheading,
  limit,
  slidesPerView,
  ctaLabel,
  ctaHref,
}: ProductsCarouselProps) {
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
          const data = await getProducts({
            first: limit,
            sortKey: "CREATED_AT",
            reverse: true,
          });
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
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
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
              href={
                ctaHref ||
                (collection?.handle ? `/collections/${collection.handle}` : "/collections")
              }
              className="text-sm font-medium tracking-wide hover:opacity-70"
            >
              {ctaLabel} →
            </Link>
          ) : null}
        </div>

        <Carousel opts={{ align: "start", loop: true }}>
          <CarouselContent className="-ml-6">
            {(products.length === 0
              ? Array.from({ length: limit }).map((_, i) => ({ id: `sk-${i}` }))
              : products
            ).map((p: any) => (
              <CarouselItem
                key={p.id}
                className={`pl-6 basis-full sm:basis-1/2 ${basisClass[slidesPerView]}`}
              >
                {products.length === 0 ? (
                  <div className="aspect-[4/5] w-full animate-pulse rounded-md bg-muted" />
                ) : (
                  <ProductCard product={p} />
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 md:left-4" />
          <CarouselNext className="right-2 md:right-4" />
        </Carousel>
      </Container>
    </section>
  );
}
