// Re-exported from the server-safe catalogue module so both client components
// and Route Handlers can search the storefront.
export { searchProducts, searchSuggestions } from '@/services/shopify/catalog';
export type {
  SearchSortKey,
  SearchFilter,
  SearchFilterValue,
  SearchProductsResult,
  SearchSuggestion,
} from '@/services/shopify/catalog';
