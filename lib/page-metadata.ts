import type { Metadata } from 'next';
import { site } from '@/config/site';

/** The subset of root props (see config/root.tsx) that describes a page. */
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
  /** Root-relative path, used for the canonical and og:url. */
  path?: string;
}

/**
 * Turns a page.json's root props into Next metadata. The editor exposes
 * title/description/ogImage on the root, so editing a page in the editor is
 * what changes its tags; `overrides` lets dynamic routes layer fetched product,
 * collection or policy data on top.
 */
export function pageMetadata(
  page: EditorPage,
  overrides: MetadataOverrides = {}
): Metadata {
  const props = page.root?.props ?? {};

  // Editor-authored titles already carry the brand ("About — Shop"), so they
  // opt out of the root template with `absolute`. A fetched override is a bare
  // product or collection name and flows through the template instead.
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
