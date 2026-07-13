'use client';

import { useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icons';

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
  error?: string;
  hint?: string;
  describedBy?: string;
  trailing?: ReactNode;
};

export function PasswordField({
  id,
  label,
  error,
  hint,
  describedBy,
  trailing,
  className,
  ...inputProps
}: PasswordFieldProps) {
  const t = useTranslations('auth');
  const [visible, setVisible] = useState(false);
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint && !error ? `${id}-hint` : undefined;
  const ariaDescribedBy =
    [describedBy, errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <p className="m-0">
      <span className="mb-1 flex items-center justify-between gap-2">
        <label htmlFor={id} className="label mb-0">
          {label}
        </label>
        {trailing}
      </span>
      <span className="relative block">
        <input
          {...inputProps}
          id={id}
          type={visible ? 'text' : 'password'}
          className={`input pr-10 ${className ?? ''}`}
          aria-invalid={Boolean(error)}
          aria-describedby={ariaDescribedBy}
        />
        <button
          type="button"
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-[var(--muted)] transition-colors hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? t('hidePassword') : t('showPassword')}
          aria-pressed={visible}
        >
          {visible ? (
            <EyeOffIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </button>
      </span>
      {error && (
        <strong id={errorId} className="error-text font-normal">
          {error}
        </strong>
      )}
      {hint && !error && (
        <small id={hintId} className="mt-1 block text-xs text-[var(--muted)]">
          {hint}
        </small>
      )}
    </p>
  );
}
