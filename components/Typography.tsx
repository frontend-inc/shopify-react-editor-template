import * as React from "react";
import { cn } from "@/lib/utils";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "subtitle1"
  | "subtitle2"
  | "body1"
  | "body2"
  | "caption";

const sizeClasses: Record<TypographyVariant, string> = {
  h1: "text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05]",
  h2: "text-4xl md:text-5xl tracking-tight leading-[1.1]",
  h3: "text-3xl md:text-4xl tracking-tight leading-tight",
  h4: "text-2xl md:text-3xl tracking-tight leading-snug",
  h5: "text-xl md:text-2xl leading-snug",
  h6: "text-lg md:text-xl leading-snug",
  subtitle1: "text-lg md:text-xl leading-relaxed text-muted-foreground",
  subtitle2: "text-base md:text-lg leading-relaxed text-muted-foreground",
  body1: "text-lg leading-relaxed",
  body2: "text-base leading-relaxed",
  caption: "text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground",
};

// Inline-style fallbacks so headings size correctly even when Tailwind
// preflight resets <h1>..<h6> to font-size: inherit and the iframe CDN
// hasn't compiled utility classes yet. The Tailwind classes above still
// apply on top once available (responsive breakpoints, leading, etc.).
const sizeStyles: Record<TypographyVariant, React.CSSProperties> = {
  h1: { fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.05, letterSpacing: "-0.02em" },
  h2: { fontSize: "clamp(2rem, 4vw, 3rem)",     lineHeight: 1.1,  letterSpacing: "-0.02em" },
  h3: { fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)", lineHeight: 1.15, letterSpacing: "-0.015em" },
  h4: { fontSize: "clamp(1.5rem, 3vw, 1.875rem)",   lineHeight: 1.2,  letterSpacing: "-0.01em" },
  h5: { fontSize: "1.5rem",   lineHeight: 1.25 },
  h6: { fontSize: "1.25rem",  lineHeight: 1.3 },
  subtitle1: { fontSize: "1.125rem", lineHeight: 1.6 },
  subtitle2: { fontSize: "1rem",     lineHeight: 1.6 },
  body1: { fontSize: "1.125rem", lineHeight: 1.6 },
  body2: { fontSize: "1rem",     lineHeight: 1.6 },
  caption: { fontSize: "0.75rem", lineHeight: 1.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" },
};

const defaultTag: Record<TypographyVariant, keyof JSX.IntrinsicElements> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  subtitle1: "p",
  subtitle2: "p",
  body1: "p",
  body2: "p",
  caption: "p",
};

type Props<C extends keyof JSX.IntrinsicElements = "p"> = {
  variant: TypographyVariant;
  as?: C;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<C>, "className" | "children" | "style">;

export function Typography<C extends keyof JSX.IntrinsicElements = "p">({
  variant,
  as,
  className,
  style,
  children,
  ...rest
}: Props<C>) {
  const Tag = (as ?? defaultTag[variant]) as keyof JSX.IntrinsicElements;
  const isHeading = variant.startsWith("h");
  const fontClass = isHeading ? "font-heading" : "font-body";

  // Apply the heading font + weight inline so the styling holds even when
  // the rendered element isn't h1–h6 (e.g. <span> via the `as` prop). The
  // ThemeProvider's element-scoped CSS rule only matches real h-tags, and
  // the `font-heading` Tailwind utility can't be relied on in CDN mode.
  const fontStyles: React.CSSProperties = isHeading
    ? {
        fontFamily: "var(--font-header), system-ui, sans-serif",
        fontWeight: "var(--font-weight-header, 600)",
      }
    : {};

  return React.createElement(
    Tag,
    {
      className: cn(fontClass, sizeClasses[variant], className),
      style: { ...fontStyles, ...sizeStyles[variant], ...style },
      ...rest,
    },
    children,
  );
}

export default Typography;
