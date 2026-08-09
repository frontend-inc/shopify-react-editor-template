'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';

export interface AccountFormField {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password';
  autoComplete?: string;
  required?: boolean;
}

interface AccountFormProps {
  title: string;
  description?: string;
  fields: AccountFormField[];
  submitLabel: string;
  endpoint: string;
  /** Merged into the request body alongside the field values. */
  extraPayload?: Record<string, string>;
  /** Where to go on success; omit to show `successMessage` instead. */
  redirectTo?: string;
  successMessage?: string;
  footer?: React.ReactNode;
}

const AccountForm: React.FC<AccountFormProps> = ({
  title,
  description,
  fields,
  submitLabel,
  endpoint,
  extraPayload,
  redirectTo,
  successMessage,
  footer,
}) => {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, ...extraPayload }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      if (redirectTo) {
        // refresh() so server components re-read the new session cookie.
        router.push(redirectTo);
        router.refresh();
      } else {
        setDone(true);
      }
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="text-2xl font-normal text-foreground">{title}</h1>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}

      {done && successMessage ? (
        <p className="mt-6 text-sm text-foreground">{successMessage}</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {fields.map((field) => (
            <label key={field.name} className="flex flex-col gap-1.5">
              <span className="text-sm text-muted-foreground">
                {field.label}
              </span>
              <input
                type={field.type ?? 'text'}
                name={field.name}
                required={field.required ?? true}
                autoComplete={field.autoComplete}
                value={values[field.name] ?? ''}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    [field.name]: event.target.value,
                  }))
                }
                className="h-11 rounded-md border border-border px-3 text-sm outline-none transition-colors focus:border-foreground"
              />
            </label>
          ))}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={submitting} className="h-11">
            {submitting && <Loader size={16} />}
            {submitLabel}
          </Button>
        </form>
      )}

      {footer && (
        <div className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
};

export const AccountFormLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <Link href={href} className="underline underline-offset-2 hover:text-foreground">
    {children}
  </Link>
);

export default AccountForm;
