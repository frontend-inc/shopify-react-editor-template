import Link from "next/link";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/Typography";

export type CoverButtonVariant = "primary" | "secondary" | "outline" | "ghost";

export type CoverButton = {
  label: string;
  href: string;
  variant: CoverButtonVariant;
};

export type CoverProps = {
  tagline: string;
  heading: string;
  subheading: string;
  buttons: CoverButton[];
  imageUrl: string;
  align: "left" | "center";
  height: "md" | "lg" | "full";
  tone: "light" | "dark";
};

const heightClass: Record<CoverProps["height"], string> = {
  md: "min-h-[60vh]",
  lg: "min-h-[80vh]",
  full: "min-h-screen",
};

function buttonClass(variant: CoverButtonVariant, isDark: boolean): string {
  switch (variant) {
    case "primary":
      return cn(
        "inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium tracking-wide transition-opacity hover:opacity-90",
        isDark ? "bg-white text-black" : "bg-foreground text-background",
      );
    case "secondary":
    case "outline":
      return cn(
        "inline-flex items-center justify-center rounded-md border px-6 py-3 text-sm font-medium tracking-wide transition-opacity hover:opacity-80",
        isDark ? "border-white text-white" : "border-foreground text-foreground",
      );
    case "ghost":
      return cn(
        "inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium tracking-wide transition-opacity hover:opacity-80",
        isDark ? "text-white" : "text-foreground",
      );
  }
}

export function Cover({
  tagline,
  heading,
  subheading,
  buttons,
  imageUrl,
  align,
  height,
  tone,
}: CoverProps) {
  const isDark = tone === "dark";
  const visibleButtons = (buttons ?? []).filter((b) => b?.label);

  return (
    <section
      className={cn(
        "relative flex w-full items-end overflow-hidden isolate",
        heightClass[height],
      )}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />
      ) : null}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: isDark
            ? "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)"
            : "linear-gradient(180deg, rgba(255,255,255,0.0) 30%, rgba(255,255,255,0.85) 100%)",
        }}
      />

      <div
        className={cn(
          "container relative z-[2] mx-auto flex max-w-7xl flex-col px-6 py-20 md:py-28",
          align === "center" ? "items-center text-center" : "items-start",
          isDark ? "text-white" : "text-foreground",
        )}
      >
        {tagline ? (
          <Typography
            variant="caption"
            className={cn(
              "mb-5",
              isDark ? "text-white/80" : "text-foreground/70",
            )}
          >
            {tagline}
          </Typography>
        ) : null}
        <Typography variant="h1" className="max-w-3xl">
          {heading}
        </Typography>
        {subheading ? (
          <Typography
            variant="subtitle1"
            className={cn(
              "mt-6 max-w-xl",
              isDark ? "text-white/80" : "text-foreground/70",
            )}
          >
            {subheading}
          </Typography>
        ) : null}

        {visibleButtons.length > 0 ? (
          <div
            className={cn(
              "mt-10 flex flex-wrap gap-3",
              align === "center" && "justify-center",
            )}
          >
            {visibleButtons.map((b, i) => (
              <Link
                key={`${b.href}-${b.label}-${i}`}
                href={b.href || "#"}
                className={buttonClass(b.variant, isDark)}
              >
                {b.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
