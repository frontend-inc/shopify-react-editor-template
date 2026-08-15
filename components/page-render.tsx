'use client';

import { Render } from '@reacteditor/core/render';
import { appConfig } from '@/editor.config';
import globals from '@/app.globals.json';

export type PageData = {
  root?: unknown;
  content?: unknown;
  globals?: unknown;
};

export default function PageRender({ page }: { page: PageData }) {
  const data = { root: page.root, content: page.content, globals };
  return <Render config={appConfig as any} data={data as any} />;
}
