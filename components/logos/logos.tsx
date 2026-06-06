import { Container } from "@/components/layout/Container";
import { Typography } from "@/components/Typography";

export type LogosProps = {
  tagline: string;
  items: Array<{ src: string; alt: string }>;
  layout: "row" | "marquee";
};

export function Logos({ tagline, items, layout }: LogosProps) {
  return (
    <section className="border-y border-border bg-muted/40 py-12">
      <Container>
        {tagline ? (
          <Typography variant="caption" className="mb-8 text-center">
            {tagline}
          </Typography>
        ) : null}
        {layout === "marquee" ? (
          <div className="overflow-hidden">
            <div className="flex animate-[marquee_30s_linear_infinite] gap-16 [--gap:4rem]">
              {[...items, ...items].map((it, i) => (
                <img
                  key={i}
                  src={it.src}
                  alt={it.alt}
                  className="h-7 w-auto opacity-60 grayscale"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {items.map((it, i) => (
              <img
                key={i}
                src={it.src}
                alt={it.alt}
                className="h-7 w-auto opacity-60 grayscale"
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
