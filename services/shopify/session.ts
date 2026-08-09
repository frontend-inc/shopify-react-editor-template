// Customer session, stored in an httpOnly cookie. Server-only: importing this
// from a client component will fail, which is deliberate — the access token
// must never reach the browser's JavaScript.
import { cookies } from 'next/headers';
import { CUSTOMER_TOKEN_COOKIE } from '@/services/shopify/customer';

export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(CUSTOMER_TOKEN_COOKIE)?.value ?? null;
}

export async function setSessionToken(
  accessToken: string,
  expiresAt: string
): Promise<void> {
  const store = await cookies();
  const expires = new Date(expiresAt);

  store.set(CUSTOMER_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: Number.isNaN(expires.getTime()) ? undefined : expires,
  });
}

export async function clearSessionToken(): Promise<void> {
  const store = await cookies();
  store.delete(CUSTOMER_TOKEN_COOKIE);
}
