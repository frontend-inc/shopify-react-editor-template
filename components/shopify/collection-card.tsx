import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Typography } from '@/components/Typography';

interface CollectionImage {
  url: string;
  altText?: string;
}

interface Collection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: CollectionImage;
}

interface CollectionCardProps {
  collection: Collection;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  return (
    <Link href={`/collections/${collection.handle}`} className="block group">
      <Card className="hover:shadow-xl transition-shadow duration-300 overflow-hidden py-0 gap-0">
        {/* Collection Image */}
        <div className="aspect-video overflow-hidden bg-muted">
          {collection.image ? (
            <img
              src={collection.image.url}
              alt={collection.image.altText || collection.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <i className="ri-folder-line text-6xl"></i>
            </div>
          )}
        </div>

        {/* Collection Info */}
        <CardContent className="p-6">
          <Typography
            variant="subtitle1"
            className="mb-3 font-semibold tracking-tight text-foreground transition-colors group-hover:text-muted-foreground"
          >
            {collection.title}
          </Typography>

          {collection.description && (
            <p className="text-muted-foreground">
              {collection.description.substring(0, 100)}
              {collection.description.length > 100 ? '...' : ''}
            </p>
          )}

          <div className="mt-4 text-foreground font-semibold group-hover:text-muted-foreground transition-colors flex items-center">
            <span>View Collection</span>
            <i className="ri-arrow-right-s-line ml-2"></i>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CollectionCard;