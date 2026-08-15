import { ComponentConfig } from '@reacteditor/core';
import { Search } from 'lucide-react';
import SearchResults from '@/components/shopify/search-results';

export type SearchResultsBlockProps = {
  title?: string;
};

const searchResultsEditor: ComponentConfig<SearchResultsBlockProps> = {
  label: 'Search results',
  icon: <Search size={16} />,
  category: 'commerce',
  defaultProps: {
    title: 'Search',
  },
  fields: {
    title: { label: 'Title', type: 'text', contentEditable: true },
  },
  render: (props) => <SearchResults {...props} />,
};

export default searchResultsEditor;
