'use client';

import { Render } from '@reacteditor/core/render';
import { appConfig } from '@/editor.config';
import layout from '@/app.layout.json';

export type PageData = {
  metadata?: unknown;
  content?: unknown;
};

export default function PageRender({ page }: { page: PageData }) {
  const data = { metadata: page.metadata, content: page.content, layout };
  return <Render config={appConfig as any} data={data as any} />;
}
