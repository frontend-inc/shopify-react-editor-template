import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Heading } from "@/components/Heading";

export type TestimonialsProps = {
  tagline: string;
  heading: string;
  items: Array<{
    quote: string;
    author: string;
    role: string;
    avatar?: string;
  }>;
};

export function Testimonials({ tagline, heading, items }: TestimonialsProps) {
  const [i, setI] = useState(0);
  const total = items.length;
  const item = items[i];

  return (
    <section className="bg-muted/40 py-20 md:py-28">
      <div className="container mx-auto max-w-4xl px-6 text-center">
        <Heading
          tagline={tagline}
          title={heading}
          align="center"
          size="lg"
        />

        {item ? (
          <div className="relative mt-12">
            {total > 1 ? (
              <button
                onClick={() => setI((p) => (p - 1 + total) % total)}
                className="absolute left-0 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border h-10 w-10 hover:bg-background md:inline-flex"
                aria-label="Previous"
              >
                <ArrowLeft size={16} />
              </button>
            ) : null}

            <figure className="mx-auto flex max-w-2xl flex-col items-center px-12 md:px-16">
              <blockquote
                className="text-balance text-foreground"
                style={{ fontSize: "clamp(1.25rem, 2.4vw, 1.75rem)", lineHeight: 1.4 }}
              >
                {item.quote}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3">
                {item.avatar ? (
                  <img
                    src={item.avatar}
                    alt={item.author}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : null}
                <div className="text-left">
                  <p className="text-sm font-medium">{item.author}</p>
                  {item.role ? (
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  ) : null}
                </div>
              </figcaption>
            </figure>

            {total > 1 ? (
              <button
                onClick={() => setI((p) => (p + 1) % total)}
                className="absolute right-0 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border h-10 w-10 hover:bg-background md:inline-flex"
                aria-label="Next"
              >
                <ArrowRight size={16} />
              </button>
            ) : null}

            {total > 1 ? (
              <div className="mt-8 flex items-center justify-center gap-3 md:hidden">
                <button
                  onClick={() => setI((p) => (p - 1 + total) % total)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border hover:bg-background"
                  aria-label="Previous"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  onClick={() => setI((p) => (p + 1) % total)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border hover:bg-background"
                  aria-label="Next"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
