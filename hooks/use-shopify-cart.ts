'use client';

import { create } from 'zustand';
import { storefront, unwrapStorefrontResult } from '@/services/shopify/client';
import {
  CREATE_CART_MUTATION,
  ADD_CART_LINES_MUTATION,
  UPDATE_CART_LINES_MUTATION,
  REMOVE_CART_LINES_MUTATION,
  UPDATE_CART_DISCOUNT_CODES_MUTATION,
  GET_CART_QUERY,
} from '@/graphql/cart';
import { useEffect } from 'react';

export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
}

export interface CartLineUpdateInput {
  id: string;
  quantity: number;
}

interface CartLine {
  id: string;
  quantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
    price: {
      amount: string;
      currencyCode: string;
    };
    image?: {
      id?: string | null;
      url: string;
      altText?: string | null;
      width?: number | null;
      height?: number | null;
    } | null;
    product: {
      id: string;
      title: string;
      handle: string;
      vendor?: string;
    };
  };
}

export interface CartDiscountCode {
  code: string;
  applicable: boolean;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  discountCodes?: CartDiscountCode[];
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalTaxAmount?: {
      amount: string;
      currencyCode: string;
    } | null;
  };
  lines: {
    edges: Array<{
      node: CartLine;
    }>;
  };
}

/** Normalizes nullable Shopify cart mutation payloads. */
function unwrapCartPayload<T>(
  payload:
    | {
        cart?: T | null;
        userErrors: ReadonlyArray<{ message: string }>;
      }
    | null
    | undefined
): T {
  if (payload?.userErrors.length) {
    throw new Error(payload.userErrors[0].message);
  }

  if (!payload?.cart) {
    throw new Error('Cart update failed. Please try again.');
  }

  return payload.cart;
}

async function createCartApi(lines: CartLineInput[] = []): Promise<Cart> {
  const data = unwrapStorefrontResult(
    await storefront.graphql(CREATE_CART_MUTATION, {
      variables: { lines: lines.length > 0 ? lines : null },
    }),
    'CreateCart'
  );

  return unwrapCartPayload(data.cartCreate);
}

async function addCartLinesApi(
  cartId: string,
  lines: CartLineInput[]
): Promise<Cart> {
  const data = unwrapStorefrontResult(
    await storefront.graphql(ADD_CART_LINES_MUTATION, {
      variables: { cartId, lines },
    }),
    'AddCartLines'
  );

  return unwrapCartPayload(data.cartLinesAdd);
}

async function updateCartLinesApi(
  cartId: string,
  lines: CartLineUpdateInput[]
): Promise<Cart> {
  const data = unwrapStorefrontResult(
    await storefront.graphql(UPDATE_CART_LINES_MUTATION, {
      variables: { cartId, lines },
    }),
    'UpdateCartLines'
  );

  return unwrapCartPayload(data.cartLinesUpdate);
}

async function removeCartLinesApi(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  const data = unwrapStorefrontResult(
    await storefront.graphql(REMOVE_CART_LINES_MUTATION, {
      variables: { cartId, lineIds },
    }),
    'RemoveCartLines'
  );

  return unwrapCartPayload(data.cartLinesRemove);
}

async function updateCartDiscountCodesApi(
  cartId: string,
  discountCodes: string[]
): Promise<Cart> {
  const data = unwrapStorefrontResult(
    await storefront.graphql(UPDATE_CART_DISCOUNT_CODES_MUTATION, {
      variables: { cartId, discountCodes },
    }),
    'UpdateCartDiscountCodes'
  );

  return unwrapCartPayload(data.cartDiscountCodesUpdate);
}

async function getCartApi(cartId: string): Promise<Cart | null> {
  const data = unwrapStorefrontResult(
    await storefront.graphql(GET_CART_QUERY, { variables: { cartId } }),
    'GetCart'
  );

  return data.cart;
}

export function redirectToCheckout(checkoutUrl: string): void {
  if (checkoutUrl) {
    window.location.href = checkoutUrl;
  }
}

const CART_ID_KEY = 'cartId';

interface CartState {
  isOpen: boolean;
  cartId: string | null;
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  _initialized: boolean;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  initCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<Cart>;
  removeItem: (lineId: string) => Promise<Cart>;
  updateItemQuantity: (lineId: string, quantity: number) => Promise<Cart>;
  applyDiscountCode: (code: string) => Promise<Cart>;
  refreshCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  isOpen: false,
  cartId: null,
  cart: null,
  loading: true,
  error: null,
  _initialized: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

  initCart: () => {
    if (get()._initialized) return;
    set({ _initialized: true });

    if (typeof window === 'undefined') return;

    const storedCartId = localStorage.getItem(CART_ID_KEY);
    if (!storedCartId) {
      set({ loading: false });
      return;
    }

    set({ loading: true });
    getCartApi(storedCartId)
      .then((fetchedCart) => {
        if (fetchedCart) {
          set({ cart: fetchedCart, cartId: storedCartId, loading: false });
        } else {
          localStorage.removeItem(CART_ID_KEY);
          set({ cartId: null, cart: null, loading: false });
        }
      })
      .catch(() => {
        localStorage.removeItem(CART_ID_KEY);
        set({
          cartId: null,
          cart: null,
          loading: false,
          error: 'Failed to fetch cart',
        });
      });
  },

  addItem: async (variantId: string, quantity: number = 1) => {
    try {
      set({ loading: true, error: null });

      let currentCartId = get().cartId;
      if (!currentCartId) {
        const storedCartId = localStorage.getItem(CART_ID_KEY);
        if (storedCartId) {
          currentCartId = storedCartId;
          set({ cartId: storedCartId });
        } else {
          const newCart = await createCartApi();
          localStorage.setItem(CART_ID_KEY, newCart.id);
          set({ cart: newCart, cartId: newCart.id });
          currentCartId = newCart.id;
        }
      }

      const updatedCart = await addCartLinesApi(currentCartId, [
        { merchandiseId: variantId, quantity },
      ]);
      set({ cart: updatedCart, loading: false });
      return updatedCart;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to add item to cart';
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },

  removeItem: async (lineId: string) => {
    const { cartId } = get();
    if (!cartId) throw new Error('No cart exists');

    try {
      set({ loading: true, error: null });
      const updatedCart = await removeCartLinesApi(cartId, [lineId]);
      set({ cart: updatedCart, loading: false });
      return updatedCart;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to remove item from cart';
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },

  updateItemQuantity: async (lineId: string, quantity: number) => {
    const { cartId, removeItem } = get();
    if (!cartId) throw new Error('No cart exists');

    if (quantity <= 0) {
      return removeItem(lineId);
    }

    try {
      set({ loading: true, error: null });
      const updatedCart = await updateCartLinesApi(cartId, [
        { id: lineId, quantity },
      ]);
      set({ cart: updatedCart, loading: false });
      return updatedCart;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update item quantity';
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },

  // Invalid discount codes return `applicable: false` instead of an error.
  applyDiscountCode: async (code: string) => {
    const { cartId } = get();
    if (!cartId) throw new Error('No cart exists');

    try {
      set({ loading: true, error: null });
      const trimmed = code.trim();
      const updatedCart = await updateCartDiscountCodesApi(
        cartId,
        trimmed ? [trimmed] : []
      );
      set({ cart: updatedCart, loading: false });
      return updatedCart;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to apply discount code';
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },

  refreshCart: async () => {
    const storedCartId = localStorage.getItem(CART_ID_KEY);
    if (!storedCartId) {
      set({ loading: false });
      return;
    }

    try {
      set({ loading: true, error: null });
      const fetchedCart = await getCartApi(storedCartId);
      if (fetchedCart) {
        set({ cart: fetchedCart, cartId: storedCartId, loading: false });
      } else {
        localStorage.removeItem(CART_ID_KEY);
        set({ cartId: null, cart: null, loading: false });
      }
    } catch (err) {
      localStorage.removeItem(CART_ID_KEY);
      set({
        cartId: null,
        cart: null,
        loading: false,
        error: 'Failed to fetch cart',
      });
    }
  },
}));

export function useShopifyCart() {
  const store = useCartStore();

  useEffect(() => {
    if (!store._initialized) {
      store.initCart();
    }
  }, []);

  const items = store.cart?.lines?.edges?.map((edge) => edge.node) ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = parseFloat(store.cart?.cost?.totalAmount?.amount ?? '0');
  const checkoutUrl = store.cart?.checkoutUrl ?? null;

  return {
    isOpen: store.isOpen,
    openCart: store.openCart,
    closeCart: store.closeCart,
    toggleCart: store.toggleCart,
    cartId: store.cartId,
    cart: store.cart,
    items,
    itemCount,
    totalAmount,
    checkoutUrl,
    loading: store.loading,
    error: store.error,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateItemQuantity: store.updateItemQuantity,
    applyDiscountCode: store.applyDiscountCode,
    refreshCart: store.refreshCart,
  };
}
