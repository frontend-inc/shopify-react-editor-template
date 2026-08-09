'use client';

import { Render } from '@reacteditor/core/render';
import { appConfig } from '@/editor.config';
import globals from '@/app.globals.json';

export type PageData = {
  root?: unknown;
  content?: unknown;
  globals?: unknown;
};

/**
 * Shared renderer for a route. Drop a `page.json` next to a route's `page.tsx`,
 * import it, and hand it here:
 *
 *   import page from "./page.json";
 *   export default () => <PageRender page={page} />;
 *
 * The same `appConfig` backs `PageEditor`, so what an editor sees is what the
 * route ships.
 *
 * `app.globals.json` carries the props of blocks marked `global: true` — the
 * header and footer. Every page.json references them via `"synced": true`, so
 * editing the header once updates all thirteen routes.
 */
export default function PageRender({ page }: { page: PageData }) {
  const data = { root: page.root, content: page.content, globals };
  return <Render config={appConfig as any} data={data as any} />;
}
