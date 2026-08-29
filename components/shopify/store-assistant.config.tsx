import { ComponentConfig } from '@reacteditor/core';
import { MessageCircle } from 'lucide-react';
import StoreAssistant from '@/components/shopify/store-assistant';

export type StoreAssistantBlockProps = Record<string, never>;

const storeAssistantEditor: ComponentConfig<StoreAssistantBlockProps> = {
  label: 'Store assistant',
  icon: <MessageCircle size={16} />,
  category: 'content',
  defaultProps: {},
  fields: {},
  render: () => <StoreAssistant />,
};

export default storeAssistantEditor;
