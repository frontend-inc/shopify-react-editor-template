'use client';

import { useCallback, useMemo } from 'react';
import { Editor, outlinePlugin, type Data } from '@reacteditor/core';
import createTailwindCdnPlugin from '@reacteditor/plugin-tailwind-cdn';
import { createShopifyPlugin } from '@reacteditor/plugin-shopify';
import { appConfig } from '@/editor.config';
import { publishPage } from '@/lib/publish-page';
import globals from '@/app.globals.json';

const plugins = [
  outlinePlugin(),
  createTailwindCdnPlugin(),
  createShopifyPlugin({
    storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ?? 'mock.shop',
    publicAccessToken:
      process.env.NEXT_PUBLIC_SHOPIFY_PUBLIC_ACCESS_TOKEN ?? undefined,
    apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION ?? '2026-07',
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
      color="teal"
      ui={{ leftSideBarVisible: false }}
      config={appConfig as any}
      data={data}
      plugins={plugins}
      onPublish={handlePublish}
    />
  );
}
