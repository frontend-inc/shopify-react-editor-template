import { Menu as MenuIcon, ShoppingBag, Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useShopifyCart } from "@/hooks/use-shopify-cart";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Container } from "@/components/layout/Container";
import { Typography } from "@/components/Typography";
import { cn } from "@/lib/utils";

export type NavigationProps = {
  brand: string;
  logo?: string;
  links: Array<{ label: string; href: string }>;
  showSearch: "yes" | "no";
  showCart: "yes" | "no";
  sticky: "yes" | "no";
  tone: "default" | "muted" | "inverse";
};

export function Navigation({
  brand,
  logo,
  links,
  showSearch,
  showCart,
  sticky,
  tone,
}: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const cart = useShopifyCart();
  const itemCount = cart?.itemCount ?? 0;

  const toneClass: Record<NavigationProps["tone"], string> = {
    default: "bg-background text-foreground border-b border-border",
    muted: "bg-muted/40 text-foreground border-b border-border",
    inverse: "bg-foreground text-background",
  };

  return (
    <>
      <div
        className={cn(
          "w-full",
          sticky === "yes" && "sticky top-0 z-40",
        )}
      >
      <header
        className={cn(
          "w-full",
          sticky === "yes" && "backdrop-blur",
          toneClass[tone],
        )}
      >
        <Container className="flex h-16 items-center justify-between md:h-20">
          <Link href="/" className="inline-flex items-center">
            {logo ? (
              <img
                src={logo}
                alt={brand || "Brand Logo"}
                className="h-8 w-auto object-contain"
              />
            ) : (
              <Typography variant="h3" as="span">
                {brand || "Brand Logo"}
              </Typography>
            )}
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                className="text-sm tracking-wide opacity-80 transition-opacity hover:opacity-100"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            {showSearch === "yes" && (
              <Link
                href="/search"
                aria-label="Search"
                className="hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-foreground/5 md:inline-flex"
              >
                <Search size={18} strokeWidth={1.5} />
              </Link>
            )}
            {showCart === "yes" && (
              <button
                onClick={() => cart.openCart()}
                aria-label="Cart"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-foreground/5"
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium text-background">
                    {itemCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-foreground/5 md:hidden"
            >
              <MenuIcon size={20} strokeWidth={1.5} />
            </button>
          </div>
        </Container>
      </header>
      </div>

      {/* Mobile menu */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-[88vw] max-w-sm">
          <SheetHeader>
            <SheetTitle className="text-left">{brand}</SheetTitle>
          </SheetHeader>
          <nav className="mt-2 flex flex-col gap-1 px-4">
            {links.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                className="rounded-md px-3 py-3 text-base hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

    </>
  );
}
