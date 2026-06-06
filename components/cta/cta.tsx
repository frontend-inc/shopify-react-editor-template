import Link from "next/link";
import { cn } from "@/lib/utils";
import { Heading } from "@/components/Heading";

export type CTAProps = {
  tagline: string;
  heading: string;
  subheading: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  imageUrl: string;
  align: "left" | "center";
};

export function CTA({
  tagline,
  heading,
  subheading,
  primaryCta,
  secondaryCta,
  imageUrl,
  align,
}: CTAProps) {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 -z-10">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/45" />
          </>
        ) : (
          <div className="h-full w-full bg-foreground" />
        )}
      </div>
      <div
        className={cn(
          "container mx-auto flex max-w-4xl flex-col px-6 text-white",
          align === "center" ? "items-center text-center" : "items-start",
        )}
      >
        <Heading
          tagline={tagline}
          title={heading}
          subtitle={subheading}
          align={align === "center" ? "center" : "left"}
          size="lg"
          tone="light"
          subtitleClassName="max-w-xl"
        />
        <div
          className={cn(
            "mt-10 flex flex-wrap gap-3",
            align === "center" && "justify-center",
          )}
        >
          {primaryCta?.label ? (
            <Link
              href={primaryCta.href || "#"}
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-medium tracking-wide text-black hover:opacity-90"
            >
              {primaryCta.label}
            </Link>
          ) : null}
          {secondaryCta?.label ? (
            <Link
              href={secondaryCta.href || "#"}
              className="inline-flex items-center justify-center rounded-md border border-white px-6 py-3 text-sm font-medium tracking-wide text-white hover:bg-white/10"
            >
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
