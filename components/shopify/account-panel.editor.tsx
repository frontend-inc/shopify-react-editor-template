import { ComponentConfig } from '@reacteditor/core';
import { KeyRound, LogIn, UserPlus } from 'lucide-react';
import AccountPanel, {
  type AccountFlow,
  type AccountPanelProps,
} from '@/components/shopify/account-panel';

/**
 * One component, five registered blocks. `flow` decides the field list and the
 * API endpoint, so it lives in `defaultProps` and is deliberately absent from
 * `fields` — it is behaviour, not content. Everything editable here is copy.
 */
const accountBlock = (
  flow: AccountFlow,
  label: string,
  icon: React.ReactNode,
  defaults: Omit<AccountPanelProps, 'flow'>
): ComponentConfig<AccountPanelProps> => ({
  label,
  icon,
  category: 'account',
  defaultProps: { flow, ...defaults },
  fields: {
    title: { label: 'Title', type: 'text', contentEditable: true },
    description: {
      label: 'Description',
      type: 'textarea',
      contentEditable: true,
    },
    submitLabel: { label: 'Button label', type: 'text', contentEditable: true },
    successMessage: {
      label: 'Success message',
      type: 'textarea',
      contentEditable: true,
    },
    links: {
      label: 'Footer links',
      type: 'array',
      defaultItemProps: { label: 'Link', url: '/account/login' },
      getItemSummary: (item) => item?.label || 'Link',
      arrayFields: {
        label: { label: 'Label', type: 'text', contentEditable: true },
        url: { label: 'Link', type: 'text' },
      },
    },
  },
  render: (props) => <AccountPanel {...props} />,
});

export const accountLoginEditor = accountBlock(
  'login',
  'Sign in form',
  <LogIn size={16} />,
  {
    title: 'Sign in',
    description: '',
    submitLabel: 'Sign in',
    successMessage: '',
    links: [
      { label: 'Create an account', url: '/account/register' },
      { label: 'Forgot your password?', url: '/account/recover' },
    ],
  }
);

export const accountRegisterEditor = accountBlock(
  'register',
  'Register form',
  <UserPlus size={16} />,
  {
    title: 'Create account',
    description: '',
    submitLabel: 'Create account',
    successMessage: '',
    links: [{ label: 'Already have an account? Sign in', url: '/account/login' }],
  }
);

export const accountRecoverEditor = accountBlock(
  'recover',
  'Password recovery form',
  <KeyRound size={16} />,
  {
    title: 'Reset password',
    description:
      "Enter your email and we'll send you a link to set a new password.",
    submitLabel: 'Send reset link',
    successMessage:
      'If that email has an account, a reset link is on its way.',
    links: [{ label: 'Back to sign in', url: '/account/login' }],
  }
);

export const accountResetEditor = accountBlock(
  'reset',
  'Set password form',
  <KeyRound size={16} />,
  {
    title: 'Set a new password',
    description: '',
    submitLabel: 'Save password',
    successMessage: '',
    links: [],
  }
);

export const accountActivateEditor = accountBlock(
  'activate',
  'Activate account form',
  <KeyRound size={16} />,
  {
    title: 'Activate your account',
    description: 'Choose a password to finish setting up your account.',
    submitLabel: 'Activate account',
    successMessage: '',
    links: [],
  }
);
