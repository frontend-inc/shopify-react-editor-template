import Link from "next/link";
import { cn } from "@/lib/utils";

export type BannerProps = {
  text: string;
  ctaLabel: string;
  ctaHref: string;
  tone: "default" | "inverse" | "muted";
};

export function Banner({ text, ctaLabel, ctaHref, tone }: BannerProps) {
  const toneClass: Record<BannerProps["tone"], string> = {
    default: "bg-foreground text-background",
    inverse: "bg-background text-foreground border-y border-border",
    muted: "bg-muted text-foreground border-y border-border",
  };
  return (
    <div className={cn("w-full py-2 text-center text-xs tracking-[0.18em] uppercase", toneClass[tone])}>
      <div className="container mx-auto flex flex-col items-center justify-center gap-2 px-6 sm:flex-row">
        <span>{text}</span>
        {ctaLabel ? (
          <Link
            href={ctaHref || "#"}
            className="underline-offset-4 hover:underline"
          >
            {ctaLabel} →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
