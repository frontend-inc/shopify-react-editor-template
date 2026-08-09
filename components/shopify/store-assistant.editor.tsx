import { ComponentConfig } from '@reacteditor/core';
import { MessageCircle } from 'lucide-react';
import StoreAssistant from '@/components/shopify/store-assistant';

export type StoreAssistantBlockProps = Record<string, never>;

/**
 * The floating AI shopping assistant. It has no editable copy — its prompts and
 * suggestions come from `/api/chat` — so it is registered purely so a page can
 * choose whether to carry it.
 */
const storeAssistantEditor: ComponentConfig<StoreAssistantBlockProps> = {
  label: 'Store assistant',
  icon: <MessageCircle size={16} />,
  category: 'content',
  defaultProps: {},
  fields: {},
  render: () => <StoreAssistant />,
};

export default storeAssistantEditor;
