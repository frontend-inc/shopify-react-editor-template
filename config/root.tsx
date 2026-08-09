import { RootConfig } from '@reacteditor/core';

/**
 * Root props are the page's *content*, not its design. Colours, fonts, radius
 * and spacing all live in `app/globals.css` and in the components themselves —
 * the editor only owns the words and the imagery. See `editor.config.tsx` for
 * the same rule applied to every block.
 *
 * The field names below are the ones `pageMetadata()` reads, so editing a page
 * in the editor is what changes its `<head>` tags.
 */
export type RootProps = {
  title?: string;
  description?: string;
  ogImage?: string;
};

export const Root: RootConfig<{ props: RootProps }> = {
  // Root props default to being shared across pages. These are per-page SEO
  // tags — `pageMetadata()` reads them straight off each `page.json` — so
  // opting out keeps every route's title and description its own. The header
  // and footer blocks are the things that stay global.
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
  // No wrapper: the storefront's own layout and stylesheet own the chrome.
  render: ({ children }) => <>{children}</>,
};

export default Root;
