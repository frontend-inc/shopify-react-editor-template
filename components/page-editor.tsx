'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Editor, outlinePlugin, type Data } from '@reacteditor/core';
import { Loader } from '@/components/ui/loader';
import createTailwindCdnPlugin from '@reacteditor/plugin-tailwind-cdn';
import { createShopifyPlugin } from '@reacteditor/plugin-shopify';
import { appConfig } from '@/editor.config';
import { ROUTE_KEYS, editorHref, findPageRoute } from '@/lib/pages';

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

const EMPTY_PAGE: Data = { root: { props: { title: 'Untitled' } }, content: [] };

export interface PageEditorProps {
  /** Route key from `lib/pages.ts`, e.g. `/products/[handle]`. */
  routeKey: string;
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
 * Data is read from and published back to the route's own `page.json` through
 * `/api/pages`, which writes the file on disk.
 */
export default function PageEditor({ routeKey }: PageEditorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const [data, setData] = useState<Data | null>(null);
  const [status, setStatus] = useState<string | null>(null);

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

  useEffect(() => {
    let cancelled = false;
    setData(null);

    fetch(`/api/pages?route=${encodeURIComponent(routeKey)}`)
      .then((response) => response.json())
      .then((body) => {
        if (!cancelled) setData(body.page ?? EMPTY_PAGE);
      })
      .catch(() => {
        if (!cancelled) setData(EMPTY_PAGE);
      });

    return () => {
      cancelled = true;
    };
  }, [routeKey]);

  const handlePublish = useCallback(
    async (published: Data) => {
      setStatus('Saving…');

      try {
        const response = await fetch('/api/pages', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ route: routeKey, page: published }),
        });
        const body = await response.json().catch(() => ({}));

        if (!response.ok) {
          setStatus(body.error ?? 'Could not save this page.');
          return;
        }

        setStatus(`Saved to ${body.file}`);
      } catch {
        setStatus('Could not reach the server.');
      }
    },
    [routeKey]
  );

  // Wait for the fetch: handing <Editor> a placeholder and then swapping it
  // would seed the undo history with a page the author never wrote.
  //
  // Uses the local `components/ui/loader`, not core's export of the same name:
  // core's is built on Chakra's Spinner and reads a context that only exists
  // inside `<Editor>`, so it throws when used for a pre-Editor wait state.
  // This one is provider-free SVG and renders anywhere.
  if (!data) {
    return (
      <div
        className="flex h-screen items-center justify-center text-muted-foreground"
        role="status"
        aria-label={`Loading ${routeKey}`}
      >
        <Loader size={24} />
      </div>
    );
  }

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
