import { Suspense } from 'react';
import PageRender from '@/components/page-render';
import { pageMetadata } from '@/lib/page-metadata';
import page from './page.json';

export const metadata = pageMetadata(page, { path: '/search' });

export default function Page() {
  return (
    // The search-results block reads useSearchParams, which needs a Suspense
    // boundary to prerender this route.
    <Suspense fallback={<div className="py-10" />}>
      <PageRender page={page} />
    </Suspense>
  );
}
