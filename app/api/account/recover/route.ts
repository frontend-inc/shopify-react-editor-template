import { recoverPassword } from '@/services/shopify/customer';

export async function POST(req: Request) {
  const { email } = await req.json();

  if (email) await recoverPassword(email);

  // Always the same response, so the form can't reveal who has an account.
  return Response.json({ ok: true });
}
