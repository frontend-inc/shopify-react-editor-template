/**
 * Every editor-driven route in the app.
 *
 * `key` is what the editor's page picker shows and what `onPublish` hands back;
 * `dir` is the folder under `app/` holding that route's `page.json`. Keeping
 * the list here means the publish action can validate a route key against it
 * rather than trusting a path from the browser.
 */
export interface PageRoute {
  key: string;
  label: string;
  /** Path under `app/`, relative and without a leading slash. */
  dir: string;
}

export const PAGE_ROUTES: PageRoute[] = [
  { key: '/', label: 'Home', dir: '' },
  { key: '/about', label: 'About', dir: 'about' },
  { key: '/collections', label: 'Collections', dir: 'collections' },
  {
    key: '/collections/[handle]',
    label: 'Collection detail',
    dir: 'collections/[handle]',
  },
  {
    key: '/products/[handle]',
    label: 'Product detail',
    dir: 'products/[handle]',
  },
  { key: '/search', label: 'Search', dir: 'search' },
  { key: '/policies/[handle]', label: 'Policy', dir: 'policies/[handle]' },
];

export const ROUTE_KEYS = PAGE_ROUTES.map((route) => route.key);

export function findPageRoute(key: string): PageRoute | undefined {
  return PAGE_ROUTES.find((route) => route.key === key);
}

/**
 * URL of the editor for a route: every public route has an `/editor` child, so
 * `/products/warrior-club-hoodie` is edited at
 * `/products/warrior-club-hoodie/editor`.
 *
 * Dynamic segments are filled from `params` when the caller knows them. The
 * page picker doesn't — switching to `/products/[handle]` there lands on the
 * literal `[handle]`, where the blocks render their empty state until a product
 * is picked. Opening the editor from a real product page is the path that
 * gives them concrete params.
 */
export function editorHref(
  routeKey: string,
  params: Record<string, string | undefined> = {}
): string {
  const base =
    routeKey === '/'
      ? ''
      : routeKey.replace(
          /\[(\w+)\]/g,
          (segment, name: string) => params[name] ?? segment
        );

  return `${base}/editor`;
}
