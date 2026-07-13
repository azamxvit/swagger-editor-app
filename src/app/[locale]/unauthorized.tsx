'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';

export default function UnauthorizedPage() {
  const t = useTranslations('errors');
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace('/'), 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <section className="flex flex-col items-center justify-center py-24 text-center" aria-labelledby="unauthorized-title">
      <h1 id="unauthorized-title" className="text-4xl font-bold">
        401
      </h1>
      <p className="mt-4 text-lg">{t('unauthorized')}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{t('redirecting')}</p>
    </section>
  );
}
