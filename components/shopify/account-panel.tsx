'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import AccountForm, {
  AccountFormLink,
  type AccountFormField,
} from '@/components/shopify/account-form';

/**
 * The account routes are all the same form with a different field list and a
 * different endpoint. Those two things are behaviour, not content, so they are
 * fixed here per flow and are deliberately *not* exposed as editor fields —
 * the editor only gets the wording (see `account-panel.editor.tsx`).
 */
export type AccountFlow =
  | 'login'
  | 'register'
  | 'recover'
  | 'reset'
  | 'activate';

const EMAIL: AccountFormField = {
  name: 'email',
  label: 'Email',
  type: 'email',
  autoComplete: 'email',
};

const FLOWS: Record<
  AccountFlow,
  {
    fields: AccountFormField[];
    endpoint: string;
    redirectTo?: string;
    /** Reads Shopify's emailed `/{id}/{token}` link segments into the body. */
    usesRouteToken?: 'resetToken' | 'activationToken';
  }
> = {
  login: {
    fields: [
      EMAIL,
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        autoComplete: 'current-password',
      },
    ],
    endpoint: '/api/account/login',
    redirectTo: '/account',
  },
  register: {
    fields: [
      {
        name: 'firstName',
        label: 'First name',
        autoComplete: 'given-name',
        required: false,
      },
      {
        name: 'lastName',
        label: 'Last name',
        autoComplete: 'family-name',
        required: false,
      },
      EMAIL,
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        autoComplete: 'new-password',
      },
    ],
    endpoint: '/api/account/register',
    redirectTo: '/account',
  },
  recover: {
    fields: [EMAIL],
    endpoint: '/api/account/recover',
  },
  reset: {
    fields: [
      {
        name: 'password',
        label: 'New password',
        type: 'password',
        autoComplete: 'new-password',
      },
    ],
    endpoint: '/api/account/reset',
    redirectTo: '/account',
    usesRouteToken: 'resetToken',
  },
  activate: {
    fields: [
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        autoComplete: 'new-password',
      },
    ],
    endpoint: '/api/account/activate',
    redirectTo: '/account',
    usesRouteToken: 'activationToken',
  },
};

export interface AccountPanelLink {
  label: string;
  url: string;
}

export interface AccountPanelProps {
  flow?: AccountFlow;
  title?: string;
  description?: string;
  submitLabel?: string;
  successMessage?: string;
  /** Rendered under the form — "New here? Create an account", etc. */
  links?: AccountPanelLink[];
}

const AccountPanel: React.FC<AccountPanelProps> = ({
  flow = 'login',
  title = 'Sign in',
  description,
  submitLabel = 'Sign in',
  successMessage,
  links = [],
}) => {
  const params = useParams();
  const config = FLOWS[flow] ?? FLOWS.login;

  const extraPayload = config.usesRouteToken
    ? {
        id: (params?.id as string) ?? '',
        [config.usesRouteToken]: (params?.token as string) ?? '',
      }
    : undefined;

  return (
    <main className="max-w-screen-2xl mx-auto w-full px-8 py-16">
      <AccountForm
        title={title}
        description={description}
        fields={config.fields}
        submitLabel={submitLabel}
        endpoint={config.endpoint}
        extraPayload={extraPayload}
        redirectTo={config.redirectTo}
        successMessage={successMessage}
        footer={
          links.length > 0 ? (
            <>
              {links.map((link) => (
                <AccountFormLink key={link.url} href={link.url}>
                  {link.label}
                </AccountFormLink>
              ))}
            </>
          ) : undefined
        }
      />
    </main>
  );
};

export default AccountPanel;
