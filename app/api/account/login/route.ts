import { login, customerErrorMessage } from '@/services/shopify/customer';
import { setSessionToken } from '@/services/shopify/session';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json(
      { error: 'Enter your email and password.' },
      { status: 400 }
    );
  }

  const { token, errors } = await login(email, password);

  if (!token) {
    // Shopify distinguishes wrong-password from unknown-email; collapse both so
    // the form can't be used to enumerate accounts.
    return Response.json(
      {
        error: errors.length
          ? 'Incorrect email or password.'
          : customerErrorMessage(errors),
      },
      { status: 401 }
    );
  }

  await setSessionToken(token.accessToken, token.expiresAt);
  return Response.json({ ok: true });
}
