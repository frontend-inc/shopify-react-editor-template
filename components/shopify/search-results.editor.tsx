import { ComponentConfig } from '@reacteditor/core';
import { Search } from 'lucide-react';
import SearchResults from '@/components/shopify/search-results';

export type SearchResultsBlockProps = {
  title?: string;
};

/**
 * The result set comes from the `?q=` param and the shopper's own filter and
 * sort choices, so the heading is the only thing left for the editor to own.
 */
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
