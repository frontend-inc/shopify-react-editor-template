import PageRender from '@/components/page-render';
import { pageMetadata } from '@/lib/page-metadata';
import page from './page.json';

export const metadata = pageMetadata(page);

export default function Page() {
  return <PageRender page={page} />;
}
