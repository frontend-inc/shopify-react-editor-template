'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RiUserLine } from '@remixicon/react';

interface SessionCustomer {
  displayName: string;
  email: string;
  firstName?: string | null;
}

const AccountMenu: React.FC = () => {
  const router = useRouter();
  const [customer, setCustomer] = useState<SessionCustomer | null>(null);
  const [open, setOpen] = useState(false);

  // The token lives in an httpOnly cookie, so the signed-in state has to come
  // from the server rather than being read directly.
  useEffect(() => {
    let cancelled = false;

    fetch('/api/account/me')
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) setCustomer(data.customer ?? null);
      })
      .catch(() => {
        if (!cancelled) setCustomer(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSignOut = async () => {
    setOpen(false);
    await fetch('/api/account/logout', { method: 'POST' });
    setCustomer(null);
    router.push('/');
    router.refresh();
  };

  // Signed out: straight to the sign-in page, no menu.
  if (!customer) {
    return (
      <Button
        asChild
        variant="ghost"
        size="icon"
        aria-label="Sign in"
        className="rounded-full"
      >
        <Link href="/account/login">
          <RiUserLine className="size-5" />
        </Link>
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setOpen((prev) => !prev)}
        variant="ghost"
        size="icon"
        aria-label="Account menu"
        aria-expanded={open}
        className="rounded-full"
      >
        <RiUserLine className="size-5" />
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-60 rounded-md border border-border bg-background py-1 shadow-md">
            <div className="px-4 py-2">
              <p className="truncate text-sm font-medium text-foreground">
                {customer.firstName || customer.displayName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {customer.email}
              </p>
            </div>

            <div className="my-1 h-px bg-border" />

            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-foreground hover:bg-accent"
            >
              Order history
            </Link>
            <button
              onClick={handleSignOut}
              className="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-accent"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountMenu;
