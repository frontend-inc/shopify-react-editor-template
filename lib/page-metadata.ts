import type { Metadata } from 'next';
import { site } from '@/config/site';

interface EditorPage {
  root?: {
    props?: {
      title?: string;
      description?: string;
      ogImage?: string;
    };
  };
}

interface MetadataOverrides {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}

export function pageMetadata(
  page: EditorPage,
  overrides: MetadataOverrides = {}
): Metadata {
  const props = page.root?.props ?? {};

  // Editor titles already include the brand; fetched titles use the template.
  const title = overrides.title ?? props.title ?? site.storeName;
  const socialTitle = overrides.title ? `${title} — ${site.storeName}` : title;
  const description =
    overrides.description ?? props.description ?? site.description;
  const image = overrides.image ?? props.ogImage;

  return {
    title: overrides.title ? title : { absolute: title },
    description,
    alternates: overrides.path ? { canonical: overrides.path } : undefined,
    openGraph: {
      type: 'website',
      siteName: site.storeName,
      title: socialTitle,
      description,
      url: overrides.path ?? '/',
      images: image ? [{ url: image, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: image ? [image] : undefined,
    },
  };
}
