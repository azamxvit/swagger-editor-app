import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export async function Footer() {
  const t = await getTranslations('footer');
  const tNav = await getTranslations('nav');

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
        <p className="text-sm text-[var(--muted)]">{t('copyright')}</p>
        <nav className="flex gap-4 text-sm">
          <Link
            href="/about"
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            {tNav('about')}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
