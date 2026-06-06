import { useEffect, useState } from "react";
import Link from "next/link";
import { shopifyFetch } from "@/services/shopify/client";
import { GET_COLLECTIONS_QUERY } from "@/graphql/collections";
import { Container } from "@/components/layout/Container";
import { Typography } from "@/components/Typography";
import { Heading } from "@/components/Heading";

export type CollectionGridProps = {
  tagline: string;
  heading: string;
  subheading: string;
  layout: "tiles" | "editorial";
  limit: number;
};

type CollectionRow = {
  id: string;
  handle: string;
  title: string;
  description?: string;
  image?: { url: string; altText?: string };
};

export function CollectionGrid({
  tagline,
  heading,
  subheading,
  layout,
  limit,
}: CollectionGridProps) {
  const [collections, setCollections] = useState<CollectionRow[]>([]);

  useEffect(() => {
    shopifyFetch<any>({
      query: GET_COLLECTIONS_QUERY,
      variables: { first: limit },
    })
      .then((res) => {
        const list = (res.data?.collections?.edges ?? []).map((e: any) => e.node);
        setCollections(list);
      })
      .catch(() => setCollections([]));
  }, [limit]);

  const isEditorial = layout === "editorial";

  return (
    <section className="bg-background py-20 md:py-28">
      <Container>
        <Heading
          tagline={tagline}
          title={heading}
          subtitle={subheading}
          align="center"
          size="lg"
          className="mx-auto mb-12"
          maxWidth="max-w-2xl"
        />

        <div
          className={
            isEditorial
              ? "grid grid-cols-1 gap-8 md:grid-cols-2"
              : "grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4"
          }
        >
          {(collections.length === 0
            ? Array.from({ length: limit }).map((_, i) => ({ id: `sk-${i}` }) as any)
            : collections
          ).map((c: CollectionRow) => (
            <Link
              key={c.id}
              href={c.handle ? `/collections/${c.handle}` : "#"}
              className="group block"
            >
              <div
                className={`relative overflow-hidden rounded-md bg-muted ${isEditorial ? "aspect-[3/4] md:aspect-[5/6]" : "aspect-[4/5]"}`}
              >
                {c.image?.url ? (
                  <img
                    src={c.image.url}
                    alt={c.image.altText || c.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : null}
                {isEditorial ? (
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-8">
                    <div>
                      <Typography
                        variant="subtitle1"
                        className="font-semibold tracking-tight text-white"
                      >
                        {c.title}
                      </Typography>
                      <span className="mt-2 inline-flex text-xs uppercase tracking-[0.2em] text-white/80">
                        Shop now
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
              {!isEditorial ? (
                <div className="mt-4">
                  <Typography
                    variant="subtitle2"
                    className="font-medium tracking-tight text-foreground"
                  >
                    {c.title}
                  </Typography>
                </div>
              ) : null}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
