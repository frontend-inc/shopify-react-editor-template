import type { Metadata } from 'next';
import PageRender from '@/components/page-render';
import { pageMetadata } from '@/lib/page-metadata';
import { getProduct } from '@/services/shopify/shop';
import { truncate } from '@/lib/utils';
import page from './page.json';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;

  const product = await getProduct(handle).catch(() => null);
  if (!product) return pageMetadata(page);

  return pageMetadata(page, {
    title: product.title,
    description: product.description
      ? truncate(product.description, 160)
      : undefined,
    image: product.images.edges[0]?.node.url,
    path: `/products/${product.handle}`,
  });
}

export default function Page() {
  return <PageRender page={page} />;
}
