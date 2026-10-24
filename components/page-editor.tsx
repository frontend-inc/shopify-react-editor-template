'use client';

import { useCallback, useMemo } from 'react';
import {
  Editor,
  blocksPlugin,
  outlinePlugin,
  type Data,
  type Plugin,
} from '@reacteditor/core';
import createTailwindCdnPlugin from '@reacteditor/plugin-tailwind-cdn';
import { createShopifyPlugin } from '@reacteditor/plugin-shopify';
import { appConfig } from '@/editor.config';
import { publishPage } from '@/lib/publish-page';
import layout from '@/app.layout.json';
import {
  SHOPIFY_API_VERSION,
  SHOPIFY_PUBLIC_ACCESS_TOKEN,
  SHOPIFY_STORE_DOMAIN,
} from '@/services/shopify/config';

// The plugin packages ship typings built against an older core, so they're
// cast to this core's Plugin type.
const plugins = [
  blocksPlugin(),
  outlinePlugin(),
  createTailwindCdnPlugin(),
  createShopifyPlugin({
    // Same resolved config as the storefront, including the mock.shop fallback.
    storeDomain: SHOPIFY_STORE_DOMAIN,
    publicAccessToken: SHOPIFY_PUBLIC_ACCESS_TOKEN,
    apiVersion: SHOPIFY_API_VERSION,
  }),
] as Plugin[];

export interface PageEditorProps {
  pagePath: string;
  page: Record<string, unknown>;
}

export default function PageEditor({ pagePath, page }: PageEditorProps) {
  // The layout is stored once in app.layout.json and shared by every page;
  // each page.json stores only its own metadata and content.
  const data = useMemo(
    () => ({ ...page, layout }) as unknown as Data,
    [page]
  );

  const handlePublish = useCallback(
    async (published: Data) => {
      const result = await publishPage(pagePath, published);
      if (result.error) throw new Error(result.error);
    },
    [pagePath]
  );

  return (
    <Editor
      theme="light"
      config={appConfig as any}
      data={data}
      plugins={plugins}
      onPublish={handlePublish}
    />
  );
}
