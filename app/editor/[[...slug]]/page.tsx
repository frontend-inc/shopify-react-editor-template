"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Editor, blocksPlugin, outlinePlugin } from "@reacteditor/core";
import createTailwindCdnPlugin from "@reacteditor/plugin-tailwind-cdn";
import { createShopifyPlugin } from "@reacteditor/plugin-shopify";
import { mediaPlugin } from "@reacteditor/plugin-media";
import { mediaAdapter } from "@/lib/adapters/media-adapter";
import { appConfig } from "@/editor.config";
import resolveRoute from "@/lib/resolve-route";
import schema from "@/app.schema.json";
import globals from "@/app.globals.json";

export default function EditorPage() {
  const params = useParams();
  const segments = Array.isArray(params?.slug) ? (params.slug as string[]) : [];
  const { key, path, params: routeParams } = resolveRoute(segments);
  const { root, content } = (schema as any)[key] ?? {};
  const data = { root, content, globals };

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
    const resolved = route ?? { key };
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
        data={data}        
        route={{ key, path, params: routeParams }}
        plugins={plugins}
        onPublish={handlePublish}
      />
    </div>
  );
}
