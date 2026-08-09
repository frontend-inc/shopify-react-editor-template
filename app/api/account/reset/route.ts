import {
  resetPassword,
  toCustomerGid,
  customerErrorMessage,
} from '@/services/shopify/customer';
import { setSessionToken } from '@/services/shopify/session';

export async function POST(req: Request) {
  const { id, resetToken, password } = await req.json();

  if (!id || !resetToken || !password) {
    return Response.json({ error: 'This reset link is incomplete.' }, { status: 400 });
  }

  const { token, errors } = await resetPassword(
    toCustomerGid(id),
    resetToken,
    password
  );

  if (!token) {
    return Response.json({ error: customerErrorMessage(errors) }, { status: 400 });
  }

  await setSessionToken(token.accessToken, token.expiresAt);
  return Response.json({ ok: true });
}
