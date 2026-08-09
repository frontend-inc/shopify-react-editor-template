import React from 'react';
import Link from 'next/link';

interface LogoProps {
  /** Logo image URL. Falls back to the store name as a wordmark when absent. */
  src?: string | null;
  /** Wordmark text, and the image's alt text. */
  storeName?: string;
  /** Where the logo links to. Pass null to render it unwrapped. */
  href?: string | null;
  /** Sizing for the image — height only, so the aspect ratio is preserved. */
  imageClassName?: string;
  /** Sizing and weight for the wordmark fallback. */
  textClassName?: string;
}

const Logo: React.FC<LogoProps> = ({
  src,
  storeName = 'Shop',
  href = '/',
  imageClassName = 'h-6',
  textClassName = 'text-xl',
}) => {
  const mark = src ? (
    <img
      src={src}
      alt={storeName}
      className={`w-auto object-contain ${imageClassName}`}
    />
  ) : (
    <span
      className={`font-medium tracking-tight text-foreground ${textClassName}`}
    >
      {storeName}
    </span>
  );

  if (href === null) {
    return <span className="flex items-center">{mark}</span>;
  }

  return (
    <Link href={href} className="flex items-center">
      {mark}
    </Link>
  );
};

export default Logo;
