import { ComponentConfig } from '@reacteditor/core';
import type { ShopifyCollection } from '@reacteditor/plugin-shopify';
import { Boxes } from 'lucide-react';
import CollectionDetail from '@/components/shopify/collection-detail';

export type CollectionDetailBlockProps = {
  collection?: ShopifyCollection | null;
  title?: string;
};

const collectionDetailEditor: ComponentConfig<CollectionDetailBlockProps> = {
  label: 'Collection page',
  icon: <Boxes size={16} />,
  category: 'commerce',
  defaultProps: {
    collection: null,
    title: '',
  },
  fields: {
    collection: {
      label: 'Collection',
      type: 'shopifyCollection',
    } as any,
    title: {
      label: 'Title override',
      type: 'text',
      placeholder: "Leave empty to use the collection's own title",
      contentEditable: true,
    },
  },
  render: ({ collection, title }) => (
    <CollectionDetail handle={collection?.handle} title={title} />
  ),
};

export default collectionDetailEditor;
