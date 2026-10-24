import { MetadataConfig } from '@reacteditor/core';

export type MetadataProps = {
  title?: string;
  description?: string;
  ogImage?: string;
};

// Per-page SEO fields, edited in the editor's Page panel and stored in
// `data.metadata`. lib/page-metadata.ts maps them into Next metadata.
export const metadataConfig: MetadataConfig<{ props: MetadataProps }> = {
  default: {
    title: 'Shop',
    description: '',
    ogImage: '',
  },
  fields: {
    title: { label: 'Page title', type: 'text' },
    description: { label: 'Meta description', type: 'textarea' },
    ogImage: { label: 'Social share image', type: 'image' },
  },
};

export default metadataConfig;
