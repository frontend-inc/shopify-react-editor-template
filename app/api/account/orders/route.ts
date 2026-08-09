import { getSessionToken } from '@/services/shopify/session';
import { getCustomer } from '@/services/shopify/customer';

/**
 * Full customer record including orders, for the client-rendered order-history
 * block. `/api/account/me` stays the lightweight session probe the header uses
 * — it asks for zero orders — so the two don't fight over payload size.
 *
 * The access token never leaves the server: it is read from the session cookie
 * here and only the resolved customer is returned.
 */
export async function GET(request: Request) {
  const token = await getSessionToken();
  if (!token) return Response.json({ customer: null }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const parsed = Number(searchParams.get('orders'));
  const orderCount = Number.isFinite(parsed)
    ? Math.min(Math.max(Math.trunc(parsed), 1), 50)
    : 20;

  const customer = await getCustomer(token, orderCount);
  if (!customer) return Response.json({ customer: null }, { status: 401 });

  return Response.json({ customer });
}
