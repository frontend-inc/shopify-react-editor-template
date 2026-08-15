'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getShopPolicy, type ShopPolicy } from '@/hooks/use-shopify-policies';

export interface PolicyBodyProps {
  handle?: string;
  title?: string;
  notFoundMessage?: string;
}

const PolicyBody: React.FC<PolicyBodyProps> = ({
  handle: handleProp,
  title: titleProp,
  notFoundMessage = 'This policy has not been published yet.',
}) => {
  const params = useParams();
  const handle = handleProp || (params?.handle as string | undefined);

  const [policy, setPolicy] = useState<ShopPolicy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!handle) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    getShopPolicy(handle)
      .then((result) => {
        if (!cancelled) setPolicy(result);
      })
      .catch(() => {
        if (!cancelled) setPolicy(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [handle]);

  return (
    <main className="max-w-screen-2xl mx-auto w-full px-5 lg:px-10 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-normal text-foreground">
          {titleProp || policy?.title || 'Policy'}
        </h1>

        {loading ? (
          <div className="mt-8 animate-pulse space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-4 bg-zinc-100" />
            ))}
          </div>
        ) : policy ? (
          <div
            className="policy-body mt-8 text-[15px] leading-7 text-foreground"
            dangerouslySetInnerHTML={{ __html: policy.body }}
          />
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">
            {notFoundMessage}
          </p>
        )}
      </div>
    </main>
  );
};

export default PolicyBody;
