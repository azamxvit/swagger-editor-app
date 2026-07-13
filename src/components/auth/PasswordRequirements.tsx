'use client';

import { useTranslations } from 'next-intl';

interface PasswordRequirementsProps {
  password: string;
}

function Requirement({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-2 text-xs ${ok ? 'text-emerald-500' : 'text-[var(--muted)]'}`}>
      <span aria-hidden="true">{ok ? '✓' : '○'}</span>
      <span>{label}</span>
    </li>
  );
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const t = useTranslations('auth');
  const value = password ?? '';

  const checks = {
    length: value.length >= 8,
    letter: /[a-zA-Z\u00C0-\u024F\u0400-\u04FF]/.test(value),
    digit: /\d/.test(value),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(value),
  };

  return (
    <ul className="mt-2 space-y-1 rounded-md border border-[var(--border)] bg-[var(--surface)] p-3">
      <Requirement ok={checks.length} label={t('ruleLength')} />
      <Requirement ok={checks.letter} label={t('ruleLetter')} />
      <Requirement ok={checks.digit} label={t('ruleDigit')} />
      <Requirement ok={checks.special} label={t('ruleSpecial')} />
    </ul>
  );
}
