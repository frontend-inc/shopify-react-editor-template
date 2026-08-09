import { redirect } from 'next/navigation';
import PageRender from '@/components/page-render';
import { pageMetadata } from '@/lib/page-metadata';
import { getSessionToken } from '@/services/shopify/session';
import page from './page.json';

export const metadata = pageMetadata(page, { path: '/account' });

export default async function Page() {
  // The order-history block re-reads the session through /api/account/orders,
  // but bouncing signed-out visitors here avoids rendering the page at all.
  const token = await getSessionToken();
  if (!token) redirect('/account/login');

  return <PageRender page={page} />;
}
