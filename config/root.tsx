import { RootConfig } from '@reacteditor/core';

export type RootProps = {
  title?: string;
  description?: string;
  ogImage?: string;
};

export const Root: RootConfig<{ props: RootProps }> = {
  // SEO fields belong to each page rather than the global block store.
  global: false,
  defaultProps: {
    title: 'Shop',
    description: '',
    ogImage: '',
  },
  fields: {
    title: { label: 'Page title', type: 'text' },
    description: { label: 'Meta description', type: 'textarea' },
    ogImage: { label: 'Social share image', type: 'image' },
  },
  render: ({ children }) => <>{children}</>,
};

export default Root;
