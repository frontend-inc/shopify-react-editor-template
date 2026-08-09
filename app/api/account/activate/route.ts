import {
  activateAccount,
  toCustomerGid,
  customerErrorMessage,
} from '@/services/shopify/customer';
import { setSessionToken } from '@/services/shopify/session';

export async function POST(req: Request) {
  const { id, activationToken, password } = await req.json();

  if (!id || !activationToken || !password) {
    return Response.json(
      { error: 'This activation link is incomplete.' },
      { status: 400 }
    );
  }

  const { token, errors } = await activateAccount(
    toCustomerGid(id),
    activationToken,
    password
  );

  if (!token) {
    return Response.json({ error: customerErrorMessage(errors) }, { status: 400 });
  }

  await setSessionToken(token.accessToken, token.expiresAt);
  return Response.json({ ok: true });
}
