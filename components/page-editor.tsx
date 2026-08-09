'use client';

import { useCallback, useMemo, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Editor, outlinePlugin, type Data } from '@reacteditor/core';
import createTailwindCdnPlugin from '@reacteditor/plugin-tailwind-cdn';
import { createShopifyPlugin } from '@reacteditor/plugin-shopify';
import { appConfig } from '@/editor.config';
import { ROUTE_KEYS, editorHref, findPageRoute } from '@/lib/pages';
import { publishPage } from '@/lib/publish-page';
import globals from '@/app.globals.json';

// Plugin instances must keep a stable identity across renders, same as
// `appConfig`, so they are built once at module scope.
//
// The Tailwind CDN plugin only styles the editor's preview iframe; the public
// routes still get their utilities from the compiled `app/globals.css`.
const tailwindCdn = createTailwindCdnPlugin();

// Registers the `shopifyProduct` and `shopifyCollection` field types used by
// the commerce blocks. Credentials are the same public storefront pair the
// rendered components read — safe in the browser by definition.
const shopify = createShopifyPlugin({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ?? 'mock.shop',
  publicAccessToken:
    process.env.NEXT_PUBLIC_SHOPIFY_PUBLIC_ACCESS_TOKEN ?? undefined,
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION ?? '2026-07',
});

// Adds the outline panel — the tree of blocks on the page, for selecting and
// reordering without hunting through the preview.
const outline = outlinePlugin();

const plugins = [outline, tailwindCdn, shopify];

export interface PageEditorProps {
  /** Route key from `lib/pages.ts`, e.g. `/products/[handle]`. */
  routeKey: string;
  /**
   * The route's own `page.json`, imported by the `editor/page.tsx` that mounts
   * this — `import pageData from '../page.json'`. Bundled at build time, so the
   * editor opens with the page already in hand and no request to wait on.
   */
  page: Record<string, unknown>;
}

/**
 * Shared editor shell, mounted by each route's `editor/page.tsx` child. The
 * public routes mount `PageRender` against the same `appConfig`, so the two
 * never drift.
 *
 * Being a child of the route it edits is what makes the preview real: the
 * editor sits on the same dynamic segments as the public page, so a block
 * calling `useParams()` inside the preview iframe sees the actual handle from
 * `/products/warrior-club-hoodie/editor` — no stand-in data required.
 *
 * Data comes in as a prop — the route's own `page.json`, imported by the
 * `editor/page.tsx` above it — and publishing writes that same file back to
 * disk through the `publishPage` server action.
 */
export default function PageEditor({ routeKey, page }: PageEditorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const [status, setStatus] = useState<string | null>(null);

  // `app.globals.json` holds the props of blocks marked `global: true` (header,
  // footer), which every page.json references via `"synced": true`. The editor
  // needs them alongside the page so those blocks render their real content.
  const data = useMemo(
    () => ({ ...page, globals }) as unknown as Data,
    [page]
  );

  // The editor lives at `<public path>/editor`; drop that segment to recover
  // the page's own URL for the route descriptor and the URL bar.
  const publicPath = useMemo(
    () => (pathname ?? '/editor').replace(/\/editor\/?$/, '') || '/',
    [pathname]
  );

  const routeParams = useMemo(() => {
    const entries: Record<string, string | undefined> = {};
    for (const [key, value] of Object.entries(params ?? {})) {
      if (typeof value === 'string') entries[key] = value;
    }
    return entries;
  }, [params]);

  const handlePublish = useCallback(
    async (published: Data) => {
      setStatus('Saving…');

      try {
        const result = await publishPage(routeKey, published);

        setStatus(
          result.error ? result.error : `Saved to ${result.file}`
        );
      } catch {
        setStatus('Could not reach the server.');
      }
    },
    [routeKey]
  );

  return (
    <Editor
      key={routeKey}
      config={appConfig as any}
      data={data}
      plugins={plugins}
      routes={ROUTE_KEYS}
      route={{ key: routeKey, path: publicPath, params: routeParams }}
      onRouteChange={(nextKey) => {
        // The picker hands back a route key; ignore anything not registered.
        if (findPageRoute(nextKey)) router.push(editorHref(nextKey));
      }}
      onPublish={handlePublish}
      headerTitle={findPageRoute(routeKey)?.label ?? routeKey}
      // The concrete URL being previewed. The editor's own URL bar shows the
      // route key (the template being edited); this is the resolved path.
      headerPath={publicPath}
      renderHeaderActions={({ state }) => (
        <span className="text-xs text-muted-foreground">
          {status ?? `${state.data.content.length} blocks`}
        </span>
      )}
    />
  );
}
