'use client';

import React from 'react';
import Image from 'next/image';

export interface ContentSectionProps {
  eyebrow?: React.ReactNode;
  heading?: React.ReactNode;
  /**
   * Plain text when it comes from a `page.json`; while the field is being
   * edited inline the editor hands over a ReactNode instead, so this must not
   * assume a string.
   */
  body?: React.ReactNode;
  imageUrl?: string;
  imageAlt?: string;
}

/**
 * Generic prose section for the non-commerce routes (about, landing copy).
 * Typography matches the storefront's other sections — the editor supplies the
 * words and the image, never the layout.
 */
const ContentSection: React.FC<ContentSectionProps> = ({
  eyebrow,
  heading,
  body,
  imageUrl,
  imageAlt,
}) => {
  return (
    <section className="bg-background py-20">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="max-w-2xl mx-auto">
          {eyebrow && (
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              {eyebrow}
            </p>
          )}

          {heading && (
            <h1 className="mt-3 text-3xl md:text-4xl font-normal text-foreground">
              {heading}
            </h1>
          )}

          {imageUrl && (
            <div className="relative mt-10 aspect-[3/2] overflow-hidden">
              <Image
                src={imageUrl}
                // `heading` is a node while it's edited inline, and alt text
                // has to be a string — fall back to empty rather than stringify.
                alt={imageAlt || (typeof heading === 'string' ? heading : '')}
                fill
                sizes="(min-width: 768px) 42rem, 100vw"
                className="object-cover"
              />
            </div>
          )}

          {body && (
            <div className="mt-8 flex flex-col gap-4 text-[15px] leading-7 text-foreground">
              {typeof body === 'string'
                ? // Authored as plain paragraphs; blank lines separate them.
                  body
                    .split(/\n{2,}/)
                    .filter((paragraph) => paragraph.trim())
                    .map((paragraph, index) => <p key={index}>{paragraph}</p>)
                : // Mid-edit: render the editor's node as-is so inline editing
                  // keeps working. Paragraph splitting resumes once saved.
                  body}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
