import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageRender from '@/components/page-render';
import { pageMetadata } from '@/lib/page-metadata';
import { getShopPolicy, POLICY_HANDLES } from '@/hooks/use-shopify-policies';
import { site } from '@/config/site';
import page from './page.json';

export function generateStaticParams() {
  return POLICY_HANDLES.map((handle) => ({ handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const policy = await getShopPolicy(handle).catch(() => null);

  if (!policy) return pageMetadata(page);

  return pageMetadata(page, {
    title: policy.title,
    description: `Read the ${policy.title.toLowerCase()} for ${site.storeName}.`,
    path: `/policies/${policy.handle}`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  // Keep the 404 for handles Shopify doesn't know, rather than rendering the
  // policy block's "not published yet" state for a genuinely bad URL.
  if (!POLICY_HANDLES.includes(handle as (typeof POLICY_HANDLES)[number])) {
    notFound();
  }

  return <PageRender page={page} />;
}
