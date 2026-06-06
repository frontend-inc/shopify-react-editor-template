"use client";

import { useMemo } from "react";
import { usePathname, useParams } from "next/navigation";
import { Editor, blocksPlugin, outlinePlugin } from "@reacteditor/core";
import createTailwindCdnPlugin from "@reacteditor/plugin-tailwind-cdn";
import { createShopifyPlugin } from "@reacteditor/plugin-shopify";
import { mediaPlugin } from "@reacteditor/plugin-media";
import { mediaAdapter } from "@/lib/adapters/media-adapter";
import { appConfig } from "@/editor.config";
import globals from "@/app.globals.json";
import type { PageData } from "@/components/page-render";

/**
 * Shared editor for a route. In an editor route's `page.tsx`, import the
 * sibling public route's `page.json` and pass it through with the route key:
 *
 *   import page from "../page.json";
 *   export default () => <PageEditor page={page} routeKey="/app/products/[handle]" />;
 *
 * `routeKey` is the Next.js app-directory path of the route (e.g.
 * "/app/products/[handle]"); the host resolves it to `<routeKey>/page.json`
 * to know which file to save. The concrete public path and params are derived
 * separately from the live URL.
 */
export default function PageEditor({
  page,
  routeKey,
}: {
  page: PageData;
  routeKey: string;
}) {
  const pathname = usePathname() ?? "/editor";
  const params = useParams();

  // Each editor route is a `.../editor` child of its public route; the
  // published path drops that trailing segment.
  const path = pathname.replace(/\/editor$/, "") || "/";
  const routeParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(params ?? {})) {
    if (typeof value === "string") routeParams[key] = value;
  }

  const data = { root: page.root, content: page.content, globals };

  const plugins = useMemo(
    () => [
      blocksPlugin(),
      outlinePlugin(),
      mediaPlugin({
        adapter: mediaAdapter,
      }),
      createTailwindCdnPlugin(),
      createShopifyPlugin({
        storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ?? "mock.shop",
        publicAccessToken:
          process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      }),
    ],
    [],
  );

  const handlePublish = async (nextData: any, route?: any) => {
    // The page we save is always the public route — i.e. the live path with
    // the trailing `/editor` segment stripped, never the `.../editor` URL.
    const resolved = {
      key: routeKey,
      params: routeParams,
      ...(route ?? {}),
      path,
    };
    if (typeof window !== "undefined" && window.parent !== window) {
      window.parent.postMessage(
        { type: "PUBLISH", data: { data: nextData, route: resolved } },
        "*",
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="h-screen w-screen">
      <Editor
        config={appConfig as any}
        data={data as any}
        route={{ key: routeKey, path, params: routeParams }}
        plugins={plugins}
        onPublish={handlePublish}
      />
    </div>
  );
}
