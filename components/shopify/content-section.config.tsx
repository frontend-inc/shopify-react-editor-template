import { ComponentConfig } from '@reacteditor/core';
import { Text } from 'lucide-react';
import ContentSection, {
  type ContentSectionProps,
} from '@/components/shopify/content-section';

const contentSectionEditor: ComponentConfig<ContentSectionProps> = {
  label: 'Content section',
  icon: <Text size={16} />,
  category: 'content',
  defaultProps: {
    eyebrow: '',
    heading: 'About',
    body: 'Tell your store’s story here.\n\nBlank lines start a new paragraph.',
    imageUrl: '',
    imageAlt: '',
  },
  fields: {
    eyebrow: { label: 'Eyebrow', type: 'text', contentEditable: true },
    heading: { label: 'Heading', type: 'text', contentEditable: true },
    body: { label: 'Body', type: 'textarea', contentEditable: true },
    imageUrl: { label: 'Image', type: 'image' },
    imageAlt: { label: 'Image alt text', type: 'text' },
  },
  render: (props) => <ContentSection {...props} />,
};

export default contentSectionEditor;
