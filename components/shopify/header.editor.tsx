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

const headerEditor: ComponentConfig<HeaderBlockProps> = {
  label: 'Header',
  icon: <Menu size={16} />,
  category: 'navigation',
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
      // Keep this a string so blank copy can hide the announcement.
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
      showAnnouncement={showAnnouncement}
      announcement={announcement}
      announcementUrl={announcementUrl}
    />
  ),
};

export default headerEditor;
