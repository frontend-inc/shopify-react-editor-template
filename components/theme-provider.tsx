import * as React from "react";
import { useEffect, useMemo, useRef } from "react";

export type ThemeProps = {
  headerFont?: string;
  headerFontWeight?: string;
  bodyFont?: string;
  primaryColor?: string;
  primaryForegroundColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  bgColor?: string;
  fgColor?: string;
  mutedColor?: string;
  mutedForegroundColor?: string;
  borderColor?: string;
  radius?: "none" | "sm" | "md" | "lg" | "xl";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
};

const radiusMap: Record<NonNullable<ThemeProps["radius"]>, string> = {
  none: "0px",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
};

const maxWidthMap: Record<NonNullable<ThemeProps["maxWidth"]>, string> = {
  sm: "64rem",
  md: "72rem",
  lg: "80rem",
  xl: "96rem",
  full: "100%",
};

const shadowMap: Record<NonNullable<ThemeProps["shadow"]>, string> = {
  none: "0 0 #0000",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.10), 0 4px 6px -4px rgb(0 0 0 / 0.10)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.10), 0 8px 10px -6px rgb(0 0 0 / 0.10)",
};

function googleFontsHref(
  headerFont?: string,
  bodyFont?: string,
  headerFontWeight?: string,
): string | null {
  const valid = (f?: string): f is string => !!f && f !== "system-ui";
  const families: string[] = [];
  const seen = new Set<string>();

  const headerWeight = headerFontWeight || "400";
  const bodyWeights = "400;500;600;700";

  if (valid(headerFont)) {
    seen.add(headerFont);
    // Header font uses the configured weight only — avoids HTTP 400 from
    // Google Fonts when a single-weight family (e.g. Archivo Black) is paired
    // with a multi-weight default request.
    families.push(
      `family=${encodeURIComponent(headerFont)}:wght@${headerWeight}`,
    );
  }
  if (valid(bodyFont) && !seen.has(bodyFont)) {
    seen.add(bodyFont);
    families.push(
      `family=${encodeURIComponent(bodyFont)}:wght@${bodyWeights}`,
    );
  }
  if (families.length === 0) return null;
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}

export function ThemeProvider({
  headerFont,
  headerFontWeight,
  bodyFont,
  primaryColor,
  primaryForegroundColor,
  secondaryColor,
  accentColor,
  bgColor,
  fgColor,
  mutedColor,
  mutedForegroundColor,
  borderColor,
  radius,
  shadow,
  maxWidth,
  children,
}: ThemeProps & { children?: React.ReactNode }) {
  // Recompute CSS-variable map only when a relevant prop changes.
  const cssVars = useMemo<Record<string, string>>(() => {
    const vars: Record<string, string> = {};
    if (primaryColor) vars["--primary"] = primaryColor;
    if (primaryForegroundColor) vars["--primary-foreground"] = primaryForegroundColor;
    if (secondaryColor) vars["--secondary"] = secondaryColor;
    if (accentColor) vars["--accent"] = accentColor;
    if (bgColor) vars["--background"] = bgColor;
    if (fgColor) vars["--foreground"] = fgColor;
    if (mutedColor) vars["--muted"] = mutedColor;
    if (mutedForegroundColor) vars["--muted-foreground"] = mutedForegroundColor;
    if (borderColor) vars["--border"] = borderColor;
    if (radius) vars["--radius"] = radiusMap[radius];
    if (shadow) vars["--shadow"] = shadowMap[shadow];
    if (maxWidth) vars["--container-max-width"] = maxWidthMap[maxWidth];
    if (headerFont) vars["--font-header"] = `"${headerFont}", system-ui, sans-serif`;
    if (bodyFont) vars["--font-body"] = `"${bodyFont}", system-ui, sans-serif`;
    if (headerFontWeight) vars["--font-weight-header"] = headerFontWeight;
    return vars;
  }, [
    headerFont,
    headerFontWeight,
    bodyFont,
    primaryColor,
    primaryForegroundColor,
    secondaryColor,
    accentColor,
    bgColor,
    fgColor,
    mutedColor,
    mutedForegroundColor,
    borderColor,
    radius,
    shadow,
    maxWidth,
  ]);

  // Imperatively push every CSS var onto :root inside the host document
  // (which is the iframe's document for the editor preview, and the page
  // <html> for the published render). This guarantees descendants pick up
  // updates even if React's style-prop diffing missed something or the
  // base-layer rules need access via :root inheritance.
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const doc =
      rootRef.current?.ownerDocument ??
      (typeof document !== "undefined" ? document : null);
    if (!doc) return;
    const target = doc.documentElement;
    const previous: Record<string, string> = {};
    for (const [key, value] of Object.entries(cssVars)) {
      previous[key] = target.style.getPropertyValue(key);
      target.style.setProperty(key, value);
    }
    return () => {
      // Restore prior values so unmount doesn't leak our overrides.
      for (const [key, value] of Object.entries(previous)) {
        if (value) target.style.setProperty(key, value);
        else target.style.removeProperty(key);
      }
    };
  }, [cssVars]);

  const fontsHref = useMemo(
    () => googleFontsHref(headerFont, bodyFont, headerFontWeight),
    [headerFont, bodyFont, headerFontWeight],
  );

  // Plain CSS rules — applied directly, no Tailwind CDN runtime needed.
  // Body font is set on `body` once and inherited by descendants (span, a,
  // p, li, etc. don't need explicit rules — applying one to `span/a` would
  // break heading children, anchors inside headings, and any element using
  // `as="span"` to render a heading variant).
  // Form controls have user-agent defaults, so they need an explicit override.
  // Tailwind preflight resets h1..h6 to font-family: inherit, so we restore
  // the heading font + weight here using the per-page CSS vars.
  const css = `
    body {
      font-family: var(--font-body), system-ui, -apple-system, sans-serif;
    }
    button, input, textarea, select {
      font-family: inherit;
    }
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-header), system-ui, -apple-system, sans-serif;
      font-weight: var(--font-weight-header, 600);
    }
  `;

  // Tailwind theme directives — only useful if/when the CDN compiles
  // font-heading / font-body utilities. The plain CSS above handles the
  // common case so headers always render with the right font.
  const tailwindCss = `
    @theme {
      --font-family-heading: var(--font-header), system-ui, -apple-system, sans-serif;
      --font-family-body: var(--font-body), system-ui, -apple-system, sans-serif;
      --radius-sm: calc(var(--radius) * 0.5);
      --radius-md: calc(var(--radius) * 0.75);
      --radius-lg: var(--radius);
      --radius-xl: calc(var(--radius) * 1.5);
      --radius-2xl: calc(var(--radius) * 2);
      --radius-3xl: calc(var(--radius) * 3);
    }
  `;

  return (
    <>
      {fontsHref ? <link rel="stylesheet" href={fontsHref} /> : null}
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <style type="text/tailwindcss" dangerouslySetInnerHTML={{ __html: tailwindCss }} />
      <div
        ref={rootRef}
        data-theme-root
        style={cssVars as React.CSSProperties}
        className="flex min-h-screen flex-col bg-background text-foreground"
      >
        {children}
      </div>
    </>
  );
}
