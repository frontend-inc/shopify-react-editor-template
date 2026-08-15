'use client';

import React from 'react';
import Image from 'next/image';

export interface ContentSectionProps {
  eyebrow?: React.ReactNode;
  heading?: React.ReactNode;
  body?: React.ReactNode;
  imageUrl?: string;
  imageAlt?: string;
}

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
                ? body
                    .split(/\n{2,}/)
                    .filter((paragraph) => paragraph.trim())
                    .map((paragraph, index) => <p key={index}>{paragraph}</p>)
                : body}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
