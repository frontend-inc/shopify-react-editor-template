import {
  createCustomer,
  login,
  customerErrorMessage,
} from '@/services/shopify/customer';
import { setSessionToken } from '@/services/shopify/session';

export async function POST(req: Request) {
  const { email, password, firstName, lastName } = await req.json();

  if (!email || !password) {
    return Response.json(
      { error: 'Enter your email and password.' },
      { status: 400 }
    );
  }

  const { errors } = await createCustomer({
    email,
    password,
    firstName,
    lastName,
  });

  if (errors.length) {
    return Response.json({ error: customerErrorMessage(errors) }, { status: 400 });
  }

  // Sign the new customer straight in. Accounts needing email confirmation
  // won't return a token yet, which is not an error.
  const { token } = await login(email, password);

  if (token) {
    await setSessionToken(token.accessToken, token.expiresAt);
    return Response.json({ ok: true, signedIn: true });
  }

  return Response.json({ ok: true, signedIn: false });
}
