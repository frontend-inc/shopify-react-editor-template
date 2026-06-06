import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Heading } from "@/components/Heading";

export type FAQProps = {
  tagline: string;
  heading: string;
  subheading: string;
  items: Array<{ question: string; answer: string }>;
};

export function FAQ({ tagline, heading, subheading, items }: FAQProps) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container mx-auto max-w-3xl px-6">
        <Heading
          tagline={tagline}
          title={heading}
          subtitle={subheading}
          align="center"
          size="lg"
          className="mb-12"
        />

        <div className="divide-y divide-border border-y border-border">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between py-6 text-left"
                >
                  <span className="text-base font-medium tracking-tight md:text-lg">
                    {item.question}
                  </span>
                  {isOpen ? (
                    <Minus size={18} strokeWidth={1.5} className="flex-shrink-0" />
                  ) : (
                    <Plus size={18} strokeWidth={1.5} className="flex-shrink-0" />
                  )}
                </button>
                {isOpen ? (
                  <p className="pb-6 pr-8 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {item.answer}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
