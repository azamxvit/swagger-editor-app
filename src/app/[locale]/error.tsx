'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors');

  useEffect(() => {
    toast.error(t('generic'));
  }, [error, t]);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-xl font-semibold mb-2">{t('generic')}</h2>
      <p className="text-[var(--muted)] mb-6 text-sm">{error.message}</p>
      <button type="button" onClick={reset} className="btn-primary">
        Try again
      </button>
    </div>
  );
}
