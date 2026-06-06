import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/Heading";

export type ImageGalleryProps = {
  tagline: string;
  heading: string;
  subheading: string;
  layout: "grid" | "masonry" | "editorial";
  items: Array<{ src: string; alt: string; caption?: string }>;
};

export function ImageGallery({ tagline, heading, subheading, layout, items }: ImageGalleryProps) {
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

        {layout === "masonry" ? (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {items.map((it, i) => (
              <figure key={i} className="mb-4 break-inside-avoid">
                <img
                  src={it.src}
                  alt={it.alt}
                  className="w-full rounded-md object-cover"
                />
                {it.caption ? (
                  <figcaption className="mt-2 text-xs text-muted-foreground">
                    {it.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        ) : layout === "editorial" ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {items.slice(0, 5).map((it, i) => (
              <figure
                key={i}
                className={cn(
                  "overflow-hidden rounded-md bg-muted",
                  i === 0 && "md:col-span-7 md:row-span-2",
                  i === 1 && "md:col-span-5",
                  i === 2 && "md:col-span-5",
                  i === 3 && "md:col-span-6",
                  i === 4 && "md:col-span-6",
                )}
              >
                <img
                  src={it.src}
                  alt={it.alt}
                  className="h-full w-full object-cover"
                />
              </figure>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it, i) => (
              <figure key={i}>
                <img
                  src={it.src}
                  alt={it.alt}
                  className="aspect-[4/5] w-full rounded-md object-cover"
                />
                {it.caption ? (
                  <figcaption className="mt-2 text-xs text-muted-foreground">
                    {it.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
