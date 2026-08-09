'use client';

import React, { useEffect, useState } from 'react';
import OrderHistory from '@/components/shopify/order-history';
import type { Customer } from '@/services/shopify/customer';

export interface AccountOrdersProps {
  title?: string;
  /** Shown while signed out — the route guard normally redirects first. */
  signedOutMessage?: string;
  emptyMessage?: string;
  limit?: number;
}

/**
 * Client-side wrapper so order history can live in a page.json alongside the
 * other blocks. `/account/page.tsx` still guards the route server-side; this
 * re-reads the session through `/api/account/orders` so the block works the
 * same whether it is rendered by the page or previewed in the editor.
 */
const AccountOrders: React.FC<AccountOrdersProps> = ({
  title = 'Order history',
  signedOutMessage = 'Sign in to see your orders.',
  emptyMessage = "You haven't placed any orders yet.",
  limit = 20,
}) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/account/orders?orders=${limit}`)
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) setCustomer(data.customer ?? null);
      })
      .catch(() => {
        if (!cancelled) setCustomer(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [limit]);

  const orderCount = customer?.orders?.edges.length ?? 0;

  return (
    <main className="max-w-screen-2xl mx-auto w-full px-8 py-12">
      <h1 className="text-2xl md:text-3xl font-normal text-foreground">
        {title}
      </h1>

      {customer && (
        <p className="mt-1 text-sm text-muted-foreground">
          {customer.displayName} · {customer.email}
        </p>
      )}

      <div className="mt-10">
        {loading ? (
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-20 bg-zinc-100" />
            ))}
          </div>
        ) : !customer ? (
          <p className="text-sm text-muted-foreground">{signedOutMessage}</p>
        ) : orderCount === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          <OrderHistory customer={customer} />
        )}
      </div>
    </main>
  );
};

export default AccountOrders;
