import type { Metadata } from 'next';
import PageRender from '@/components/page-render';
import { pageMetadata } from '@/lib/page-metadata';
// Alias of /collections — same page.json, so editing that route updates both.
import page from '../../collections/page.json';

export const metadata: Metadata = {
  ...pageMetadata(page),
  // Point crawlers at the canonical listing.
  alternates: { canonical: '/collections' },
};

export default function Page() {
  return <PageRender page={page} />;
}
