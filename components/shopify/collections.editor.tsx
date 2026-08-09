import { ComponentConfig } from '@reacteditor/core';
import { FolderOpen } from 'lucide-react';
import Collections from '@/components/shopify/collections';

export type CollectionsBlockProps = {
  title?: string;
  subtitle?: string;
};

const collectionsEditor: ComponentConfig<CollectionsBlockProps> = {
  label: 'Collection grid',
  icon: <FolderOpen size={16} />,
  category: 'commerce',
  defaultProps: {
    title: 'Our Collections',
    subtitle: 'Discover our carefully crafted worlds',
  },
  fields: {
    title: { label: 'Title', type: 'text', contentEditable: true },
    subtitle: { label: 'Subtitle', type: 'textarea', contentEditable: true },
  },
  render: (props) => <Collections {...props} />,
};

export default collectionsEditor;
