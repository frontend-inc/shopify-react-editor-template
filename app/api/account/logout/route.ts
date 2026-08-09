import { logout } from '@/services/shopify/customer';
import { getSessionToken, clearSessionToken } from '@/services/shopify/session';

export async function POST() {
  const token = await getSessionToken();
  if (token) await logout(token);

  await clearSessionToken();
  return Response.json({ ok: true });
}
