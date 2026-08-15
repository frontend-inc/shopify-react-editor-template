'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/hooks/use-shopify-cart';
import CartDrawer from '@/components/shopify/cart-drawer';
import SearchDialog from '@/components/shopify/search-dialog';
import ShopMenu from '@/components/shopify/shop-menu';
import { RiShoppingBagLine, RiCloseLine, RiMenu3Line } from '@remixicon/react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';

const CartIcon: React.FC = () => {
  const toggleCart = useCartStore((s) => s.toggleCart);
  const cart = useCartStore((s) => s.cart);
  const itemCount =
    cart?.lines?.edges?.reduce((sum, { node }) => sum + node.quantity, 0) ?? 0;

  return (
    <Button
      onClick={toggleCart}
      variant="ghost"
      size="icon"
      aria-label={`Open bag (${itemCount})`}
      className="relative rounded-full"
    >
      <RiShoppingBagLine className="size-5" />
      {itemCount > 0 && (
        <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-mono rounded-full w-4 h-4 flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Button>
  );
};

export interface NavLink {
  label: string;
  url: string;
}

interface HeaderProps {
  storeName?: string;
  logoUrl?: string;
  links?: NavLink[];
  announcement?: React.ReactNode;
  announcementUrl?: string;
  showAnnouncement?: 'yes' | 'no';
}

const Header: React.FC<HeaderProps> = ({
  storeName = 'Logo',
  logoUrl,
  links = [
    { label: 'Shop', url: '/' },
    { label: 'Collections', url: '/collections' },
  ],
  announcement = 'Free shipping on orders over $100',
  announcementUrl,
  showAnnouncement = 'yes',
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Inline editing supplies a node, so only string values can be blank-checked.
  const hasAnnouncementText =
    typeof announcement === 'string'
      ? announcement.trim() !== ''
      : Boolean(announcement);

  const showAnnouncementBar = showAnnouncement !== 'no' && hasAnnouncementText;

  return (
    <>
      {showAnnouncementBar && (
        <div className="bg-muted text-foreground">
          <div className="max-w-screen-2xl mx-auto flex h-9 items-center justify-center px-8 text-center text-xs">
            {announcementUrl ? (
              <Link
                href={announcementUrl}
                className="underline-offset-2 hover:underline"
              >
                {announcement}
              </Link>
            ) : (
              <span>{announcement}</span>
            )}
          </div>
        </div>
      )}

      <nav className="bg-background/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="flex justify-between items-center h-14">
          <Logo src={logoUrl} storeName={storeName} />

          <div className="hidden md:flex items-center gap-x-8 text-sm">
            <ShopMenu />
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                className="text-foreground hover:text-muted-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            <SearchDialog />
            <CartIcon />

            <Button
              onClick={() => setMenuOpen(!menuOpen)}
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <RiCloseLine className="size-5" />
              ) : (
                <RiMenu3Line className="size-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-background">
          <div className="max-w-screen-2xl mx-auto px-8 pb-6 flex flex-col gap-y-4 text-sm">
            <ShopMenu mobile onNavigate={() => setMenuOpen(false)} />
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                onClick={() => setMenuOpen(false)}
                className="text-foreground hover:text-muted-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

        <CartDrawer />
      </nav>
    </>
  );
};

export default Header;
