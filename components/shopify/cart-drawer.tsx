'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCartStore, redirectToCheckout } from '@/hooks/use-shopify-cart';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetBody,
  AnimatePresence,
} from '@/components/ui/sheet';
import {
  RiCloseLine,
  RiImageLine,
  RiSubtractLine,
  RiAddLine,
} from '@remixicon/react';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty';
import { isDefaultTitleSelection } from '@/services/shopify/shop';

const CartDrawer: React.FC = () => {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const loading = useCartStore((s) => s.loading);
  const cart = useCartStore((s) => s.cart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateItemQuantity = useCartStore((s) => s.updateItemQuantity);
  const applyDiscountCode = useCartStore((s) => s.applyDiscountCode);

  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  // Track row-level work separately from the cart's global loading state.
  const [pendingLineId, setPendingLineId] = useState<string | null>(null);

  const runLineAction = async (lineId: string, action: () => Promise<unknown>) => {
    if (pendingLineId) return;

    try {
      setPendingLineId(lineId);
      await action();
    } catch (err) {
      console.error('Cart line update failed:', err);
    } finally {
      setPendingLineId(null);
    }
  };

  const items = cart?.lines?.edges?.map((edge) => edge.node) ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = parseFloat(cart?.cost?.totalAmount?.amount ?? '0');
  const checkoutUrl = cart?.checkoutUrl ?? null;
  const appliedDiscounts =
    cart?.discountCodes?.filter((discount) => discount.applicable) ?? [];

  const handleCheckout = () => {
    if (checkoutUrl) {
      redirectToCheckout(checkoutUrl);
    }
  };

  const handleApplyDiscount = async (event: React.FormEvent) => {
    event.preventDefault();
    const code = discountCode.trim();
    if (!code || applyingDiscount) return;

    try {
      setApplyingDiscount(true);
      setDiscountError(null);
      const updatedCart = await applyDiscountCode(code);

      const accepted = updatedCart.discountCodes?.some(
        (discount) =>
          discount.applicable &&
          discount.code.toLowerCase() === code.toLowerCase()
      );

      if (accepted) {
        setDiscountCode('');
      } else {
        setDiscountError('That code is not valid for this cart.');
      }
    } catch {
      setDiscountError('Could not apply that code. Please try again.');
    } finally {
      setApplyingDiscount(false);
    }
  };

  const getItemImage = (item: (typeof items)[0]) => {
    return item.merchandise.image?.url;
  };

  const getSelectedOptions = (item: (typeof items)[0]) => {
    return (item.merchandise.selectedOptions ?? []).filter(
      (option) => !isDefaultTitleSelection(option)
    );
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => !open && closeCart()}
      side="right"
    >
      <AnimatePresence>
        {isOpen && (
          <SheetContent className="w-full max-w-md" showCloseButton={false}>
            <SheetHeader className="min-h-0 px-5 py-4 border-b-0">
              <div className="flex items-center justify-between w-full">
                <SheetTitle className="text-base font-medium flex items-center gap-x-2">
                  Cart
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 text-[11px] font-medium text-background">
                    {itemCount}
                  </span>
                </SheetTitle>
                <Button
                  onClick={closeCart}
                  variant="ghost"
                  size="icon"
                  aria-label="Close cart"
                  className="rounded-full"
                >
                  <RiCloseLine className="size-5" />
                </Button>
              </div>
            </SheetHeader>

            <SheetBody className="px-5">
              {loading && items.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Loader size={20} />
                </div>
              ) : items.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>Your cart is empty</EmptyTitle>
                    <EmptyDescription>
                      Add some products to get started!
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button onClick={closeCart} className="w-full">
                      Continue Shopping
                    </Button>
                  </EmptyContent>
                </Empty>
              ) : (
                <div className="space-y-5">
                  {items.map((item) => {
                    const image = getItemImage(item);
                    const selectedOptions = getSelectedOptions(item);
                    const isPending = pendingLineId === item.id;

                    return (
                      <div key={item.id} className="flex items-start gap-x-3">
                        <div className="w-16 h-16 bg-zinc-100 overflow-hidden shrink-0">
                          {image ? (
                            <Image
                              src={image}
                              alt={item.merchandise.product.title}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                              <RiImageLine size={20} />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-x-3">
                            <h4 className="text-sm font-medium text-foreground line-clamp-2">
                              {item.merchandise.product.title}
                            </h4>
                            <span className="shrink-0 font-mono tabular-nums tracking-tight text-sm text-foreground">
                              $
                              {parseFloat(
                                item.cost?.totalAmount?.amount ??
                                  item.merchandise.price.amount
                              ).toFixed(2)}
                            </span>
                          </div>

                          {selectedOptions.length > 0 && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {selectedOptions
                                .map((option) => option.value)
                                .join(' / ')}
                            </div>
                          )}

                          <div className="flex items-center gap-x-2 mt-2">
                            <div className="inline-flex items-center rounded-full bg-secondary">
                              <Button
                                onClick={() =>
                                  runLineAction(item.id, () =>
                                    updateItemQuantity(
                                      item.id,
                                      item.quantity - 1
                                    )
                                  )
                                }
                                disabled={item.quantity <= 1 || isPending}
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Decrease quantity"
                                className="size-7 rounded-full"
                              >
                                <RiSubtractLine size={14} />
                              </Button>
                              <span className="min-w-8 px-1 text-sm tabular-nums text-center">
                                {isPending ? (
                                  <Loader size={12} className="mx-auto" />
                                ) : (
                                  item.quantity
                                )}
                              </span>
                              <Button
                                onClick={() =>
                                  runLineAction(item.id, () =>
                                    updateItemQuantity(
                                      item.id,
                                      item.quantity + 1
                                    )
                                  )
                                }
                                disabled={isPending}
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Increase quantity"
                                className="size-7 rounded-full"
                              >
                                <RiAddLine size={14} />
                              </Button>
                            </div>
                            <Button
                              onClick={() =>
                                runLineAction(item.id, () => removeItem(item.id))
                              }
                              disabled={isPending}
                              variant="link"
                              aria-label={`Remove ${item.merchandise.product.title}`}
                              className="ml-auto h-7 self-center px-0 text-xs font-normal leading-none text-muted-foreground underline decoration-dashed underline-offset-2 hover:text-foreground hover:no-underline"
                            >
                              remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </SheetBody>

            {items.length > 0 && (
              <div className="px-5 py-5 space-y-4">
                <form onSubmit={handleApplyDiscount} className="flex gap-x-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(event) => {
                      setDiscountCode(event.target.value);
                      setDiscountError(null);
                    }}
                    placeholder="Discount code"
                    aria-label="Discount code"
                    className="flex-1 h-10 rounded-md border border-border px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                  />
                  <Button
                    type="submit"
                    disabled={!discountCode.trim() || applyingDiscount}
                    className="h-10 bg-muted-foreground px-5 hover:bg-foreground"
                  >
                    {applyingDiscount ? <Loader size={16} /> : 'Apply'}
                  </Button>
                </form>

                {discountError && (
                  <p className="text-xs text-destructive">{discountError}</p>
                )}

                {appliedDiscounts.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Applied: {appliedDiscounts.map((d) => d.code).join(', ')}
                  </p>
                )}

                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-base text-foreground">
                      Estimated total
                    </span>
                    <span className="font-mono tabular-nums tracking-tight text-lg text-foreground">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Taxes and shipping calculated at checkout.
                  </p>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={!checkoutUrl || pendingLineId !== null}
                  className="h-12 w-full"
                >
                  Go to Checkout
                </Button>

                <Button
                  onClick={closeCart}
                  variant="ghost"
                  className="w-full font-normal text-muted-foreground hover:text-foreground"
                >
                  Continue Shopping
                </Button>
              </div>
            )}
          </SheetContent>
        )}
      </AnimatePresence>
    </Sheet>
  );
};

export default CartDrawer;
