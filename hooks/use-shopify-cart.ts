'use client';

import { useContext } from 'react';
import { shopifyFetch, SHOPIFY_STORE_DOMAIN } from '@/services/shopify/client';
import { CartContext } from '@/contexts/shopify-context';
import {
  CREATE_CART_MUTATION,
  ADD_CART_LINES_MUTATION,
  UPDATE_CART_LINES_MUTATION,
  REMOVE_CART_LINES_MUTATION,
  GET_CART_QUERY,
} from '@/graphql/cart';

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
      id: string;
      url: string;
      altText?: string;
      width: number;
      height: number;
    };
    product: {
      id: string;
      title: string;
      handle: string;
      vendor?: string;
    };
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
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
    };
  };
  lines: {
    edges: Array<{
      node: CartLine;
    }>;
  };
}

// Create a new cart (optionally with initial items)
export async function createCart(lines: CartLineInput[] = []): Promise<Cart> {
  const response = await shopifyFetch({
    query: CREATE_CART_MUTATION,
    variables: { lines: lines.length > 0 ? lines : null },
  });

  if (response.data.cartCreate.userErrors.length > 0) {
    throw new Error(response.data.cartCreate.userErrors[0].message);
  }

  return response.data.cartCreate.cart;
}

// Add items to cart
export async function addCartLines(cartId: string, lines: CartLineInput[]): Promise<Cart> {
  const response = await shopifyFetch({
    query: ADD_CART_LINES_MUTATION,
    variables: { cartId, lines },
  });

  if (response.data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(response.data.cartLinesAdd.userErrors[0].message);
  }

  return response.data.cartLinesAdd.cart;
}

// Update cart line quantities
export async function updateCartLines(cartId: string, lines: CartLineUpdateInput[]): Promise<Cart> {
  const response = await shopifyFetch({
    query: UPDATE_CART_LINES_MUTATION,
    variables: { cartId, lines },
  });

  if (response.data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(response.data.cartLinesUpdate.userErrors[0].message);
  }

  return response.data.cartLinesUpdate.cart;
}

// Remove items from cart
export async function removeCartLines(cartId: string, lineIds: string[]): Promise<Cart> {
  const response = await shopifyFetch({
    query: REMOVE_CART_LINES_MUTATION,
    variables: { cartId, lineIds },
  });

  if (response.data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(response.data.cartLinesRemove.userErrors[0].message);
  }

  return response.data.cartLinesRemove.cart;
}

// Get cart by ID
export async function getCart(cartId: string): Promise<Cart | null> {
  const response = await shopifyFetch({
    query: GET_CART_QUERY,
    variables: { cartId },
  });

  return response.data.cart;
}

// Redirect to Shopify checkout
export function redirectToCheckout(checkoutUrl: string): void {
  if (checkoutUrl) {
    window.location.href = checkoutUrl;
  }
}

// Hook to access cart context
export const useShopifyCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useShopifyCart must be used within a ShopifyProvider');
  }
  return context;
};
