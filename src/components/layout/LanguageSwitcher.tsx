'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

const LOCALE_LABELS: Record<string, string> = {
  en: 'EN',
  ru: 'RU',
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex rounded-lg border border-[var(--border)] overflow-hidden text-sm">
      {(['en', 'ru'] as const).map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={`px-3 py-1.5 transition-colors ${
            locale === loc
              ? 'bg-[var(--primary)] text-white'
              : 'bg-transparent text-[var(--muted)] hover:bg-[var(--surface-hover)]'
          }`}
          aria-label={`Switch to ${loc}`}
        >
          {LOCALE_LABELS[loc]}
        </button>
      ))}
    </div>
  );
}
