import React from 'react';
import Link from 'next/link';

interface LogoProps {
  src?: string | null;
  storeName?: string;
  href?: string | null;
  imageClassName?: string;
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
