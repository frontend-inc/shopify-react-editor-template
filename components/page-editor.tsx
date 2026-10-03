'use client';

import { useCallback, useMemo } from 'react';
import { Editor, outlinePlugin, type Data } from '@reacteditor/core';
import createTailwindCdnPlugin from '@reacteditor/plugin-tailwind-cdn';
import { createShopifyPlugin } from '@reacteditor/plugin-shopify';
import { appConfig } from '@/editor.config';
import { publishPage } from '@/lib/publish-page';
import globals from '@/app.globals.json';
import {
  SHOPIFY_API_VERSION,
  SHOPIFY_PUBLIC_ACCESS_TOKEN,
  SHOPIFY_STORE_DOMAIN,
} from '@/services/shopify/config';

const plugins = [
  outlinePlugin(),
  createTailwindCdnPlugin(),
  createShopifyPlugin({
    // Same resolved config as the storefront, including the mock.shop fallback.
    storeDomain: SHOPIFY_STORE_DOMAIN,
    publicAccessToken: SHOPIFY_PUBLIC_ACCESS_TOKEN,
    apiVersion: SHOPIFY_API_VERSION,
  }),
];

export interface PageEditorProps {
  pagePath: string;
  page: Record<string, unknown>;
}

export default function PageEditor({ pagePath, page }: PageEditorProps) {
  const data = useMemo(
    () => ({ ...page, globals }) as unknown as Data,
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
