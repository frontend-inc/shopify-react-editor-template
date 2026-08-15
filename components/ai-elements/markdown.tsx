"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Nodes } from "hast";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import type { Components } from "hast-util-to-jsx-runtime";
import type { ComponentProps, HTMLAttributes, MouseEvent } from "react";
import { Fragment, memo, useCallback, useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remend from "remend";
import { unified } from "unified";

// Sanitize model output and reject unsafe URL protocols.
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    // Preserve checked state for sanitized GFM task lists.
    input: [...(defaultSchema.attributes?.input ?? []), "checked"],
  },
};

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSanitize, schema);

// Keep incomplete links as text while streaming.
const REMEND_OPTIONS = { linkMode: "text-only" } as const;

// Repair only streaming text; remend can corrupt settled italicized prices.
const repair = (markdown: string, isStreaming: boolean) =>
  isStreaming ? remend(markdown, REMEND_OPTIONS) : markdown;

export interface LinkSafetyConfig {
  enabled: boolean;
  onLinkCheck?: (url: string) => boolean;
}

type AnchorProps = ComponentProps<"a"> & {
  linkSafety?: LinkSafetyConfig;
  onUntrusted: (url: string) => void;
};

const LINK_CLASS =
  "font-medium underline underline-offset-4 hover:text-foreground";

const isRouteHref = (href: string) => /^[/#?]/.test(href);

const MarkdownLink = ({
  href,
  linkSafety,
  onUntrusted,
  ...props
}: AnchorProps) => {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (!href || !linkSafety?.enabled || !linkSafety.onLinkCheck) return;
      if (linkSafety.onLinkCheck(href)) return;

      event.preventDefault();
      onUntrusted(href);
    },
    [href, linkSafety, onUntrusted]
  );

  if (href && isRouteHref(href)) {
    return <Link className={LINK_CLASS} href={href} {...props} />;
  }

  return (
    <a
      className={LINK_CLASS}
      href={href}
      onClick={handleClick}
      rel="noreferrer"
      target="_blank"
      {...props}
    />
  );
};

const buildComponents = (
  linkSafety: LinkSafetyConfig | undefined,
  onUntrusted: (url: string) => void
): Partial<Components> => ({
  a: (props: ComponentProps<"a">) => (
    <MarkdownLink {...props} linkSafety={linkSafety} onUntrusted={onUntrusted} />
  ),
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      className="my-3 border-border border-l-2 pl-3 text-muted-foreground"
      {...props}
    />
  ),
  code: ({ className, ...props }: ComponentProps<"code">) => {
    const isBlock =
      typeof className === "string" && className.includes("language-");

    return (
      <code
        className={cn(
          isBlock
            ? "font-mono text-xs"
            : "rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]",
          className
        )}
        {...props}
      />
    );
  },
  em: (props: ComponentProps<"em">) => <em className="italic" {...props} />,
  h1: (props: ComponentProps<"h1">) => (
    <h1 className="mt-4 mb-2 font-semibold text-base" {...props} />
  ),
  h2: (props: ComponentProps<"h2">) => (
    <h2 className="mt-4 mb-2 font-semibold text-base" {...props} />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3 className="mt-3 mb-1.5 font-semibold text-sm" {...props} />
  ),
  h4: (props: ComponentProps<"h4">) => (
    <h4 className="mt-3 mb-1.5 font-semibold text-sm" {...props} />
  ),
  h5: (props: ComponentProps<"h5">) => (
    <h5 className="mt-3 mb-1.5 font-semibold text-sm" {...props} />
  ),
  h6: (props: ComponentProps<"h6">) => (
    <h6 className="mt-3 mb-1.5 font-semibold text-sm" {...props} />
  ),
  hr: (props: ComponentProps<"hr">) => (
    <hr className="my-4 border-border" {...props} />
  ),
  input: (props: ComponentProps<"input">) => (
    <input className="mr-1.5 align-middle" readOnly {...props} />
  ),
  img: ({ alt, ...props }: ComponentProps<"img">) => (
    // biome-ignore lint/nursery/noImgElement: model output, not a known asset
    <img alt={alt ?? ""} className="my-2 max-w-full rounded-md" {...props} />
  ),
  li: (props: ComponentProps<"li">) => <li className="my-0.5" {...props} />,
  ol: (props: ComponentProps<"ol">) => (
    <ol className="my-2 list-decimal space-y-0.5 pl-5" {...props} />
  ),
  p: (props: ComponentProps<"p">) => (
    <p className="my-2 leading-relaxed" {...props} />
  ),
  pre: (props: ComponentProps<"pre">) => (
    <pre
      className="my-2 overflow-x-auto rounded-md bg-muted p-3 text-xs"
      {...props}
    />
  ),
  strong: (props: ComponentProps<"strong">) => (
    <strong className="font-semibold" {...props} />
  ),
  table: (props: ComponentProps<"table">) => (
    <div className="my-3 overflow-x-auto">
      <table className="w-full border-collapse text-left text-xs" {...props} />
    </div>
  ),
  td: (props: ComponentProps<"td">) => (
    <td className="border border-border px-2 py-1" {...props} />
  ),
  th: (props: ComponentProps<"th">) => (
    <th
      className="border border-border bg-muted px-2 py-1 font-medium"
      {...props}
    />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul className="my-2 list-disc space-y-0.5 pl-5" {...props} />
  ),
});

export type MarkdownProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children: string;
  isAnimating?: boolean;
  linkSafety?: LinkSafetyConfig;
};

export const Markdown = memo(
  ({
    children,
    className,
    isAnimating,
    linkSafety,
    ...props
  }: MarkdownProps) => {
    const [pending, setPending] = useState<string | null>(null);

    const handleUntrusted = useCallback((url: string) => setPending(url), []);

    const content = useMemo(() => {
      const source = repair(children ?? "", isAnimating === true);
      const tree = processor.runSync(processor.parse(source)) as Nodes;

      return toJsxRuntime(tree, {
        components: buildComponents(linkSafety, handleUntrusted),
        Fragment,
        jsx,
        jsxs,
      });
    }, [children, isAnimating, linkSafety, handleUntrusted]);

    return (
      <div
        className={cn(
          "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
          className
        )}
        {...props}
      >
        {content}
        <Dialog
          onOpenChange={(open) => !open && setPending(null)}
          open={pending !== null}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Leave this site?</DialogTitle>
              <DialogDescription>
                This link points somewhere outside the store. Continue only if
                you trust it.
              </DialogDescription>
            </DialogHeader>
            <p className="break-all rounded-md bg-muted px-3 py-2 font-mono text-xs">
              {pending}
            </p>
            <DialogFooter>
              <Button onClick={() => setPending(null)} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (pending) {
                    window.open(pending, "_blank", "noopener,noreferrer");
                  }
                  setPending(null);
                }}
              >
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
  (prev, next) =>
    prev.children === next.children && prev.isAnimating === next.isAnimating
);

Markdown.displayName = "Markdown";
