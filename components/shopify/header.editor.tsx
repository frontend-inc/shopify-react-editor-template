import { ComponentConfig } from '@reacteditor/core';
import { Menu } from 'lucide-react';
import Header from '@/components/shopify/header';

export type HeaderBlockProps = {
  storeName?: string;
  logoUrl?: string;
  showAnnouncement?: 'yes' | 'no';
  announcement?: string;
  announcementUrl?: string;
  links?: Array<{ label: string; url: string }>;
};

/**
 * Content only: the store name, the logo, the announcement copy and the nav
 * labels. Stickiness, backdrop blur, spacing and the cart/search/account
 * affordances are the component's business, not the editor's.
 */
const headerEditor: ComponentConfig<HeaderBlockProps> = {
  label: 'Header',
  icon: <Menu size={16} />,
  category: 'navigation',
  // Shared across pages: edit it once and every page.json picks it up.
  global: true,
  defaultProps: {
    storeName: 'Shop',
    logoUrl: '',
    showAnnouncement: 'yes',
    announcement: 'Free shipping on orders over $100',
    announcementUrl: '',
    links: [
      { label: 'Products', url: '/' },
      { label: 'Collections', url: '/collections' },
    ],
  },
  fields: {
    storeName: { label: 'Store name', type: 'text', contentEditable: true },
    logoUrl: { label: 'Logo', type: 'image' },
    showAnnouncement: {
      label: 'Announcement bar',
      type: 'radio',
      options: [
        { label: 'Show', value: 'yes' },
        { label: 'Hide', value: 'no' },
      ],
    },
    announcement: {
      label: 'Announcement',
      type: 'text',
      // Deliberately not `contentEditable`: an inline-edited field arrives as a
      // ReactNode, which stays truthy once emptied, so the bar would linger as
      // an empty band. Keeping it a plain string makes "blank hides it" work.
      placeholder: 'Leave empty to hide the bar',
    },
    announcementUrl: { label: 'Announcement link', type: 'text' },
    links: {
      label: 'Navigation links',
      type: 'array',
      defaultItemProps: { label: 'Link', url: '/' },
      getItemSummary: (item) => item?.label || 'Link',
      arrayFields: {
        label: { label: 'Label', type: 'text', contentEditable: true },
        url: { label: 'Link', type: 'text' },
      },
    },
  },
  render: ({
    storeName,
    logoUrl,
    showAnnouncement,
    announcement,
    announcementUrl,
    links,
  }) => (
    <Header
      storeName={storeName}
      logoUrl={logoUrl}
      links={links}
      // Header decides visibility: blank copy hides the bar, and the toggle
      // hides it regardless — needed because an inline-edited field is a node,
      // which can't be inspected for emptiness.
      showAnnouncement={showAnnouncement}
      announcement={announcement}
      announcementUrl={announcementUrl}
    />
  ),
};

export default headerEditor;
