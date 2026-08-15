import type { Metadata } from 'next';
import PageRender from '@/components/page-render';
import { pageMetadata } from '@/lib/page-metadata';
import page from '../../collections/page.json';

export const metadata: Metadata = {
  ...pageMetadata(page),
  alternates: { canonical: '/collections' },
};

export default function Page() {
  return <PageRender page={page} />;
}
