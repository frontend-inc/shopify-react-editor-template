import type { Metadata } from 'next';
import PageRender from '@/components/page-render';
import { pageMetadata } from '@/lib/page-metadata';
import { getCollectionProductsPage } from '@/services/shopify/shop';
import { truncate } from '@/lib/utils';
import page from './page.json';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;

  // Shopify exposes collection metadata through the products connection.
  const { collection } = await getCollectionProductsPage(handle, {
    first: 1,
  }).catch(() => ({ collection: null }));

  if (!collection) return pageMetadata(page);

  return pageMetadata(page, {
    title: collection.title,
    description: collection.description
      ? truncate(collection.description, 160)
      : `Shop the ${collection.title} collection.`,
    image: collection.image?.url,
    path: `/collections/${collection.handle}`,
  });
}

export default function Page() {
  return <PageRender page={page} />;
}
