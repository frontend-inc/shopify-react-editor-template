// Server-safe customer account access.
//
// The customer access token is a credential: it is only ever handled here and
// in the /api/account route handlers, and is stored in an httpOnly cookie so
// client JavaScript can never read it.
import { storefront, unwrapStorefrontResult } from '@/services/shopify/client';
import {
  CUSTOMER_QUERY,
  CUSTOMER_CREATE_MUTATION,
  CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
  CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION,
  CUSTOMER_RECOVER_MUTATION,
  CUSTOMER_RESET_MUTATION,
  CUSTOMER_ACTIVATE_MUTATION,
  CUSTOMER_UPDATE_MUTATION,
} from '@/graphql/customer';

export const CUSTOMER_TOKEN_COOKIE = 'customerAccessToken';

export interface CustomerUserError {
  /** One of `CustomerErrorCode`; kept as a string so new codes don't break. */
  code?: string | null;
  field?: string[] | null;
  message: string;
}

export interface CustomerAddress {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  province?: string | null;
  zip?: string | null;
  country?: string | null;
  phone?: string | null;
}

export interface CustomerOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus?: string | null;
  fulfillmentStatus?: string | null;
  statusUrl?: string | null;
  currentTotalPrice: { amount: string; currencyCode: string };
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        quantity: number;
        variant?: { image?: { url: string; altText?: string | null } | null } | null;
      };
    }>;
  };
}

export interface Customer {
  id: string;
  email: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  displayName: string;
  acceptsMarketing?: boolean;
  createdAt?: string;
  defaultAddress?: CustomerAddress | null;
  orders?: { edges: Array<{ node: CustomerOrder }> };
}

export interface AccessToken {
  accessToken: string;
  expiresAt: string;
}

/** Either a token (success) or the errors Shopify reported. */
export interface AuthResult {
  token: AccessToken | null;
  errors: CustomerUserError[];
}

const firstMessage = (errors: CustomerUserError[]) =>
  errors[0]?.message ?? 'Something went wrong. Please try again.';

export { firstMessage as customerErrorMessage };

// Shopify returns a null mutation payload when the mutation could not run at
// all. That is not a success, so it surfaces as a generic error rather than an
// empty error list, which callers read as "it worked".
const MUTATION_FAILED: CustomerUserError[] = [
  { message: 'Something went wrong. Please try again.' },
];

export async function createCustomer(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  acceptsMarketing?: boolean;
}): Promise<{ errors: CustomerUserError[] }> {
  const data = unwrapStorefrontResult(
    await storefront.graphql(CUSTOMER_CREATE_MUTATION, {
      variables: { input },
    }),
    'CustomerCreate'
  );

  const result = data.customerCreate;
  if (!result) return { errors: MUTATION_FAILED };

  return { errors: result.customerUserErrors ?? [] };
}

export async function login(
  email: string,
  password: string
): Promise<AuthResult> {
  const data = unwrapStorefrontResult(
    await storefront.graphql(CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION, {
      variables: { input: { email, password } },
    }),
    'CustomerAccessTokenCreate'
  );

  const result = data.customerAccessTokenCreate;
  if (!result) return { token: null, errors: MUTATION_FAILED };

  return {
    token: result.customerAccessToken ?? null,
    errors: result.customerUserErrors ?? [],
  };
}

export async function logout(accessToken: string): Promise<void> {
  try {
    await storefront.graphql(CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION, {
      variables: { customerAccessToken: accessToken },
    });
  } catch (err) {
    // The cookie is cleared regardless; a failed revoke shouldn't block logout.
    console.error('Failed to revoke customer access token:', err);
  }
}

// Always resolves without error detail: revealing whether an address exists
// would leak account membership.
export async function recoverPassword(email: string): Promise<void> {
  try {
    await storefront.graphql(CUSTOMER_RECOVER_MUTATION, {
      variables: { email },
    });
  } catch (err) {
    console.error('Password recovery request failed:', err);
  }
}

export async function resetPassword(
  id: string,
  resetToken: string,
  password: string
): Promise<AuthResult> {
  const data = unwrapStorefrontResult(
    await storefront.graphql(CUSTOMER_RESET_MUTATION, {
      variables: { id, input: { resetToken, password } },
    }),
    'CustomerReset'
  );

  const result = data.customerReset;
  if (!result) return { token: null, errors: MUTATION_FAILED };

  return {
    token: result.customerAccessToken ?? null,
    errors: result.customerUserErrors ?? [],
  };
}

export async function activateAccount(
  id: string,
  activationToken: string,
  password: string
): Promise<AuthResult> {
  const data = unwrapStorefrontResult(
    await storefront.graphql(CUSTOMER_ACTIVATE_MUTATION, {
      variables: { id, input: { activationToken, password } },
    }),
    'CustomerActivate'
  );

  const result = data.customerActivate;
  if (!result) return { token: null, errors: MUTATION_FAILED };

  return {
    token: result.customerAccessToken ?? null,
    errors: result.customerUserErrors ?? [],
  };
}

export async function getCustomer(
  accessToken: string,
  orderCount = 10
): Promise<Customer | null> {
  try {
    const data = unwrapStorefrontResult(
      await storefront.graphql(CUSTOMER_QUERY, {
        variables: { customerAccessToken: accessToken, orderCount },
      }),
      'GetCustomer'
    );

    return data.customer ?? null;
  } catch (err) {
    // An expired or revoked token reads as "not signed in".
    console.error('Failed to load customer:', err);
    return null;
  }
}

export async function updateCustomer(
  accessToken: string,
  customer: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }
): Promise<{ customer: Customer | null; errors: CustomerUserError[] }> {
  const data = unwrapStorefrontResult(
    await storefront.graphql(CUSTOMER_UPDATE_MUTATION, {
      variables: { customerAccessToken: accessToken, customer },
    }),
    'CustomerUpdate'
  );

  const result = data.customerUpdate;
  if (!result) return { customer: null, errors: MUTATION_FAILED };

  return {
    customer: result.customer ?? null,
    errors: result.customerUserErrors ?? [],
  };
}

// Shopify's emailed links carry a numeric id; the mutations want a GID.
export function toCustomerGid(id: string): string {
  return id.startsWith('gid://') ? id : `gid://shopify/Customer/${id}`;
}
