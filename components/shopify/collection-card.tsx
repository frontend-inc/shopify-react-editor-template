import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CollectionImage {
  url: string;
  altText?: string | null;
}

interface Collection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: CollectionImage | null;
}

interface CollectionCardProps {
  collection: Collection;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  return (
    <Link
      href={`/collections/${collection.handle}`}
      className="group block h-full"
    >
      {/* Collection Image */}
      <div className="relative aspect-square overflow-hidden">
        {collection.image ? (
          <Image
            src={collection.image.url}
            alt={collection.image.altText || collection.title}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
            <i className="ri-folder-line text-8xl"></i>
          </div>
        )}
      </div>

      {/* Collection Info */}
      <div className="flex flex-col flex-1 py-2.5">
        <h3 className="text-sm font-medium text-foreground line-clamp-1">
          {collection.title}
        </h3>
      </div>
    </Link>
  );
};

export default CollectionCard;
