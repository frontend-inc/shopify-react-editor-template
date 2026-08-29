import { ComponentConfig } from '@reacteditor/core';
import { Search } from 'lucide-react';
import SearchResults from '@/components/shopify/search-results';

export type SearchResultsBlockProps = {
  title?: string;
  placeholder?: string;
};

const searchResultsEditor: ComponentConfig<SearchResultsBlockProps> = {
  label: 'Search results',
  icon: <Search size={16} />,
  category: 'commerce',
  defaultProps: {
    title: 'Search',
    placeholder: 'Search products',
  },
  fields: {
    title: { label: 'Title', type: 'text', contentEditable: true },
    placeholder: { label: 'Search placeholder', type: 'text' },
  },
  render: (props) => <SearchResults {...props} />,
};

export default searchResultsEditor;
