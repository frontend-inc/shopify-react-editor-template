'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { RiImageLine } from '@remixicon/react';
import type { Customer, CustomerOrder } from '@/services/shopify/customer';

interface OrderHistoryProps {
  customer: Customer;
}

const formatMoney = (amount: string, currencyCode: string) => {
  const value = parseFloat(amount);
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const StatusPill: React.FC<{ label?: string | null }> = ({ label }) => {
  if (!label) return null;
  return (
    <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
      {label.replace(/_/g, ' ').toLowerCase()}
    </span>
  );
};

const OrderHistory: React.FC<OrderHistoryProps> = ({ customer }) => {
  const orders: CustomerOrder[] =
    customer.orders?.edges.map((edge) => edge.node) ?? [];

  // The Storefront API has no standalone order-by-id query for customers, so
  // the detail is rendered from the order already loaded in this list.
  const [selectedId, setSelectedId] = useState<string | null>(
    orders[0]?.id ?? null
  );
  const selected = orders.find((order) => order.id === selectedId) ?? null;

  if (orders.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        You haven&apos;t placed any orders yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
      {/* List */}
      <div className="lg:col-span-2">
        <h2 className="mb-3 text-sm text-muted-foreground">Orders</h2>
        <ul className="flex flex-col">
          {orders.map((order) => {
            const isSelected = order.id === selectedId;

            return (
              <li key={order.id}>
                <button
                  onClick={() => setSelectedId(order.id)}
                  aria-current={isSelected}
                  className={`flex w-full items-baseline justify-between gap-x-4 rounded-md px-3 py-3 text-left transition-colors ${
                    isSelected ? 'bg-secondary' : 'hover:bg-secondary/60'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground">
                      Order #{order.orderNumber}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {formatDate(order.processedAt)}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-sm tabular-nums tracking-tight text-foreground">
                    {formatMoney(
                      order.currentTotalPrice.amount,
                      order.currentTotalPrice.currencyCode
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Detail — same screen, no navigation */}
      <div className="lg:col-span-3">
        {selected && (
          <>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <h2 className="text-lg text-foreground">
                Order #{selected.orderNumber}
              </h2>
              <span className="font-mono text-base tabular-nums tracking-tight text-foreground">
                {formatMoney(
                  selected.currentTotalPrice.amount,
                  selected.currentTotalPrice.currencyCode
                )}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Placed {formatDate(selected.processedAt)}
              </span>
              <StatusPill label={selected.financialStatus} />
              <StatusPill label={selected.fulfillmentStatus} />
            </div>

            <ul className="mt-6 flex flex-col gap-4">
              {selected.lineItems.edges.map(({ node }, index) => (
                <li key={index} className="flex items-start gap-x-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden bg-zinc-100">
                    {node.variant?.image ? (
                      <Image
                        src={node.variant.image.url}
                        alt={node.variant.image.altText || node.title}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-400">
                        <RiImageLine className="size-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {node.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty {node.quantity}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {selected.statusUrl && (
              <a
                href={selected.statusUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-block text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
              >
                View order status
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
