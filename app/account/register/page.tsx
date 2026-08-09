import PageRender from '@/components/page-render';
import { pageMetadata } from '@/lib/page-metadata';
import page from './page.json';

export const metadata = pageMetadata(page, { path: '/account/register' });

export default function Page() {
  return <PageRender page={page} />;
}
