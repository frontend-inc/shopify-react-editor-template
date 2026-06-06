import * as React from "react";
import { cn } from "@/lib/utils";
import { Typography, type TypographyVariant } from "@/components/Typography";

export type HeadingSize = "sm" | "md" | "lg" | "xl";
export type HeadingAlign = "left" | "center";
export type HeadingTone = "default" | "light";

type SizeMap = {
  title: TypographyVariant;
  subtitle: TypographyVariant;
  taglineGap: string;
  subtitleGap: string;
};

const sizeMap: Record<HeadingSize, SizeMap> = {
  sm: {
    title: "h4",
    subtitle: "subtitle2",
    taglineGap: "mb-2",
    subtitleGap: "mt-2",
  },
  md: {
    title: "h3",
    subtitle: "subtitle1",
    taglineGap: "mb-3",
    subtitleGap: "mt-3",
  },
  lg: {
    title: "h2",
    subtitle: "subtitle1",
    taglineGap: "mb-3",
    subtitleGap: "mt-3",
  },
  xl: {
    title: "h1",
    subtitle: "subtitle1",
    taglineGap: "mb-4",
    subtitleGap: "mt-4",
  },
};

const alignClasses: Record<HeadingAlign, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
};

export type HeadingProps = {
  tagline?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  size?: HeadingSize;
  align?: HeadingAlign;
  tone?: HeadingTone;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  taglineClassName?: string;
  maxWidth?: string;
};

export function Heading({
  tagline,
  title,
  subtitle,
  size = "lg",
  align = "left",
  tone = "default",
  className,
  titleClassName,
  subtitleClassName,
  taglineClassName,
  maxWidth,
}: HeadingProps) {
  if (!tagline && !title && !subtitle) return null;
  const map = sizeMap[size];
  const isLight = tone === "light";

  return (
    <div className={cn("flex flex-col", alignClasses[align], maxWidth, className)}>
      {tagline ? (
        <Typography
          variant="caption"
          className={cn(
            map.taglineGap,
            isLight && "text-background/70",
            taglineClassName,
          )}
        >
          {tagline}
        </Typography>
      ) : null}
      {title ? (
        <Typography
          variant={map.title}
          className={cn(isLight && "text-background", titleClassName)}
        >
          {title}
        </Typography>
      ) : null}
      {subtitle ? (
        <Typography
          variant={map.subtitle}
          className={cn(
            map.subtitleGap,
            isLight && "text-background/70",
            subtitleClassName,
          )}
        >
          {subtitle}
        </Typography>
      ) : null}
    </div>
  );
}

export default Heading;
