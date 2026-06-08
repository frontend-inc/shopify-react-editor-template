"use client";

import { Render } from "@reacteditor/core/render";
import { appConfig } from "@/editor.config";
import globals from "@/app.globals.json";

export type PageData = {
  root?: unknown;
  content?: unknown;
};

/**
 * Shared renderer for a route. Drop a `page.json` next to a route's
 * `page.tsx`, import it, and hand it here:
 *
 *   import page from "./page.json";
 *   export default () => <PageRender page={page} />;
 */
export default function PageRender({ page }: { page: PageData }) {
  const data = { root: page.root, content: page.content, globals };
  return <Render config={appConfig as any} data={data as any} />;
}
