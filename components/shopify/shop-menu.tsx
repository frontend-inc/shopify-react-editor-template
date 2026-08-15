'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { RiArrowDownSLine } from '@remixicon/react';
import { useCollectionsOnDemand } from '@/hooks/use-shopify-collections';
import { cn } from '@/lib/utils';

interface ShopMenuProps {
  label?: string;
  mobile?: boolean;
  onNavigate?: () => void;
}

const ShopMenu: React.FC<ShopMenuProps> = ({
  label = 'Shop',
  mobile = false,
  onNavigate,
}) => {
  const [open, setOpen] = useState(false);
  const { collections, loading, error, load } = useCollectionsOnDemand();

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) load();
  };

  const close = () => {
    setOpen(false);
    onNavigate?.();
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const itemClasses = cn(
    'block text-sm text-foreground hover:bg-accent transition-colors',
    mobile ? 'px-3 py-2' : 'px-4 py-2'
  );

  const body = (
    <>
      {loading &&
        Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className={cn(itemClasses, 'py-2.5')}>
            <div className="h-3 w-2/3 animate-pulse bg-muted" />
          </div>
        ))}

      {error && (
        <div className={cn(itemClasses, 'hover:bg-transparent')}>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={load}
            className="mt-1 underline underline-offset-2 hover:text-muted-foreground"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && collections.length === 0 && (
        <p className={cn(itemClasses, 'text-muted-foreground hover:bg-transparent')}>
          No collections yet.
        </p>
      )}

      {collections.map((collection) => (
        <Link
          key={collection.id}
          href={`/collections/${collection.handle}`}
          onClick={close}
          className={itemClasses}
        >
          {collection.title}
        </Link>
      ))}

      {collections.length > 0 && (
        <>
          <div className="my-1 h-px bg-border" />
          <Link
            href="/collections"
            onClick={close}
            className={cn(itemClasses, 'text-muted-foreground')}
          >
            View all collections
          </Link>
        </>
      )}
    </>
  );

  const trigger = (
    <button
      onClick={toggle}
      aria-expanded={open}
      className={cn(
        'flex items-center gap-x-1 text-foreground hover:text-muted-foreground transition-colors',
        mobile && 'w-full justify-between'
      )}
    >
      <span>{label}</span>
      <RiArrowDownSLine
        className={cn('size-4 transition-transform', open && 'rotate-180')}
      />
    </button>
  );

  if (mobile) {
    return (
      <div>
        {trigger}
        {open && (
          <div className="mt-2 flex flex-col border-l border-border pl-1">
            {body}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {trigger}

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-2 max-h-[70vh] w-64 overflow-y-auto rounded-md border border-border bg-background py-1 shadow-md">
            {body}
          </div>
        </>
      )}
    </div>
  );
};

export default ShopMenu;
