import { ComponentConfig } from '@reacteditor/core';
import { Search } from 'lucide-react';
import { SearchProductsView, type SearchProductsProps } from '@/components/commerce/search-products';

const searchProductsEditor: ComponentConfig<SearchProductsProps> = {
  label: 'Search & filter',
  icon: <Search size={16} />,
  category: 'commerce',
  defaultProps: {
    heading: 'Shop',
    subheading: 'Browse our full collection.',
    columns: '4',
    limit: 24,
    showAvailability: 'yes',
    showPriceRange: 'yes',
    showProductType: 'yes',
    productTypeOptions: [
      { label: 'T-Shirts' },
      { label: 'Pants' },
      { label: 'Outerwear' },
      { label: 'Accessories' },
      { label: 'Shoes' },
    ],
    showVendor: 'yes',
    vendorOptions: [
      { label: 'Maison' },
      { label: 'Atelier' },
      { label: 'Studio' },
    ],
    showTags: 'yes',
    tagOptions: [
      { label: 'New' },
      { label: 'Sale' },
      { label: 'Bestseller' },
      { label: 'Limited Edition' },
    ],
    showColor: 'yes',
    colorOptions: [
      { label: 'Black', color: '#000000' },
      { label: 'White', color: '#FFFFFF' },
      { label: 'Navy', color: '#1e3a5f' },
      { label: 'Red', color: '#c0392b' },
    ],
    showStyle: 'no',
    styleOptions: [],
    showSize: 'yes',
    sizeOptions: [
      { label: 'XS' },
      { label: 'S' },
      { label: 'M' },
      { label: 'L' },
      { label: 'XL' },
    ],
    showMaterial: 'no',
    materialOptions: [],
    metafieldFilters: [],
    defaultSort: 'BEST_SELLING',
  },
  fields: {
    heading: { label: 'Heading', type: 'text', contentEditable: true },
    subheading: { label: 'Subheading', type: 'textarea', contentEditable: true },
    columns: {
      label: 'Columns',
      type: 'radio',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
    },
    limit: { label: 'Products per page', type: 'number', min: 4, max: 48 },
    defaultSort: {
      label: 'Default sort',
      type: 'select',
      options: [
        { label: 'Best Selling',       value: 'BEST_SELLING' },
        { label: 'Relevance',          value: 'RELEVANCE'    },
        { label: 'Newest',             value: 'NEWEST'       },
        { label: 'Price: Low to High', value: 'PRICE_ASC'    },
        { label: 'Price: High to Low', value: 'PRICE_DESC'   },
        { label: 'Alphabetical',       value: 'TITLE_ASC'    },
      ],
    },
    showAvailability: {
      label: 'Availability filter',
      type: 'radio',
      options: [
        { label: 'Show', value: 'yes' },
        { label: 'Hide', value: 'no'  },
      ],
    },
    showPriceRange: {
      label: 'Price range filter',
      type: 'radio',
      options: [
        { label: 'Show', value: 'yes' },
        { label: 'Hide', value: 'no'  },
      ],
    },
    showProductType: {
      label: 'Product type filter',
      type: 'radio',
      options: [
        { label: 'Show', value: 'yes' },
        { label: 'Hide', value: 'no'  },
      ],
    },
    productTypeOptions: {
      label: 'Product types',
      type: 'array',
      defaultItemProps: { label: '' },
      getItemSummary: (it: any) => it?.label || 'Type',
      arrayFields: {
        label: { label: 'Type name', type: 'text' },
      },
    },
    showVendor: {
      label: 'Brand / vendor filter',
      type: 'radio',
      options: [
        { label: 'Show', value: 'yes' },
        { label: 'Hide', value: 'no'  },
      ],
    },
    vendorOptions: {
      label: 'Brands',
      type: 'array',
      defaultItemProps: { label: '' },
      getItemSummary: (it: any) => it?.label || 'Brand',
      arrayFields: {
        label: { label: 'Brand name', type: 'text' },
      },
    },
    showTags: {
      label: 'Tags filter',
      type: 'radio',
      options: [
        { label: 'Show', value: 'yes' },
        { label: 'Hide', value: 'no'  },
      ],
    },
    tagOptions: {
      label: 'Tags',
      type: 'array',
      defaultItemProps: { label: '' },
      getItemSummary: (it: any) => it?.label || 'Tag',
      arrayFields: {
        label: { label: 'Tag name', type: 'text' },
      },
    },
    showColor: {
      label: 'Color filter',
      type: 'radio',
      options: [
        { label: 'Show', value: 'yes' },
        { label: 'Hide', value: 'no'  },
      ],
    },
    colorOptions: {
      label: 'Colors',
      type: 'array',
      defaultItemProps: { label: '', color: '#000000' },
      getItemSummary: (it: any) => it?.label || 'Color',
      arrayFields: {
        label: { label: 'Color name', type: 'text' },
        color: { label: 'Color', type: 'color' },
      },
    },
    showStyle: {
      label: 'Style filter',
      type: 'radio',
      options: [
        { label: 'Show', value: 'yes' },
        { label: 'Hide', value: 'no'  },
      ],
    },
    styleOptions: {
      label: 'Styles',
      type: 'array',
      defaultItemProps: { label: '' },
      getItemSummary: (it: any) => it?.label || 'Style',
      arrayFields: {
        label: { label: 'Style name', type: 'text' },
      },
    },
    showSize: {
      label: 'Size filter',
      type: 'radio',
      options: [
        { label: 'Show', value: 'yes' },
        { label: 'Hide', value: 'no'  },
      ],
    },
    sizeOptions: {
      label: 'Sizes',
      type: 'array',
      defaultItemProps: { label: '' },
      getItemSummary: (it: any) => it?.label || 'Size',
      arrayFields: {
        label: { label: 'Size name', type: 'text' },
      },
    },
    showMaterial: {
      label: 'Material filter',
      type: 'radio',
      options: [
        { label: 'Show', value: 'yes' },
        { label: 'Hide', value: 'no'  },
      ],
    },
    materialOptions: {
      label: 'Materials',
      type: 'array',
      defaultItemProps: { label: '' },
      getItemSummary: (it: any) => it?.label || 'Material',
      arrayFields: {
        label: { label: 'Material name', type: 'text' },
      },
    },
    metafieldFilters: {
      label: 'Metafield filters',
      type: 'array',
      defaultItemProps: { namespace: '', key: '', label: '', values: [{ label: '' }] },
      getItemSummary: (it: any) => it?.label || it?.key || 'Metafield',
      arrayFields: {
        namespace: { label: 'Namespace', type: 'text' },
        key: { label: 'Key', type: 'text' },
        label: { label: 'Label', type: 'text' },
        values: {
          label: 'Values',
          type: 'array',
          defaultItemProps: { label: '' },
          getItemSummary: (v: any) => v?.label || 'Value',
          arrayFields: {
            label: { label: 'Value', type: 'text' },
          },
        },
      },
    },
  },
  render: (props) => <SearchProductsView {...props} />,
};

export default searchProductsEditor;
