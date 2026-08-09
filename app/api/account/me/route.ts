import { getSessionToken } from '@/services/shopify/session';
import { getCustomer } from '@/services/shopify/customer';

// Minimal session probe for the header menu — never returns the access token.
export async function GET() {
  const token = await getSessionToken();
  if (!token) return Response.json({ customer: null });

  const customer = await getCustomer(token, 0);
  if (!customer) return Response.json({ customer: null });

  return Response.json({
    customer: {
      displayName: customer.displayName,
      email: customer.email,
      firstName: customer.firstName,
    },
  });
}
