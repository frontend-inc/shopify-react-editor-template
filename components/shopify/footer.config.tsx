import { ComponentConfig } from '@reacteditor/core';
import { PanelBottom } from 'lucide-react';
import Footer from '@/components/shopify/footer';

export type FooterBlockProps = {
  storeName?: string;
  logoUrl?: string;
  copyright?: string;
  links?: Array<{ label: string; url: string }>;
  instagramUrl?: string;
  tiktokUrl?: string;
  facebookUrl?: string;
};

const footerEditor: ComponentConfig<FooterBlockProps> = {
  label: 'Footer',
  icon: <PanelBottom size={16} />,
  category: 'navigation',
  global: true,
  defaultProps: {
    storeName: 'Shop',
    logoUrl: '',
    copyright: '© 2026 Shop. All rights reserved.',
    links: [
      { label: 'Terms of Service', url: '/policies/terms-of-service' },
      { label: 'Privacy Policy', url: '/policies/privacy-policy' },
      { label: 'Refund Policy', url: '/policies/refund-policy' },
      { label: 'Shipping Policy', url: '/policies/shipping-policy' },
      { label: 'Subscription Policy', url: '/policies/subscription-policy' },
    ],
    instagramUrl: '#',
    tiktokUrl: '#',
    facebookUrl: '#',
  },
  fields: {
    storeName: { label: 'Store name', type: 'text', contentEditable: true },
    logoUrl: { label: 'Logo', type: 'image' },
    copyright: { label: 'Copyright', type: 'text', contentEditable: true },
    links: {
      label: 'Links',
      type: 'array',
      defaultItemProps: { label: 'Link', url: '/' },
      getItemSummary: (item) => item?.label || 'Link',
      arrayFields: {
        label: { label: 'Label', type: 'text', contentEditable: true },
        url: { label: 'Link', type: 'text' },
      },
    },
    instagramUrl: { label: 'Instagram URL', type: 'text' },
    tiktokUrl: { label: 'TikTok URL', type: 'text' },
    facebookUrl: { label: 'Facebook URL', type: 'text' },
  },
  render: (props) => <Footer {...props} />,
};

export default footerEditor;
