'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { useAuth } from '@/components/providers/AuthProvider';
import { LanguageSwitcher } from './LanguageSwitcher';
import { HeaderAuthSkeleton } from '@/components/ui/Skeleton';
import { AppLogoIcon, HistoryIcon } from '@/components/ui/icons';
import toast from 'react-hot-toast';

export function Header() {
  const t = useTranslations();
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsSticky(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    toast.success(t('auth.signOutSuccess'));
    router.push('/');
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isSticky
          ? 'border-[var(--border)] bg-[var(--surface)]/95 py-2 shadow-sm backdrop-blur-md'
          : 'border-transparent bg-[var(--background)] py-4'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <AppLogoIcon className="h-7 w-7 shrink-0" />
            <span>{t('app.title')}</span>
          </Link>
          <nav className="hidden items-center gap-4 text-sm sm:flex">
            <Link
              href="/about"
              className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            >
              {t('nav.about')}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {loading ? (
            <HeaderAuthSkeleton />
          ) : user ? (
            <>
              <Link href="/history" className="btn-secondary gap-1.5 text-sm">
                <HistoryIcon className="h-3.5 w-3.5" />
                {t('nav.history')}
              </Link>
              <button type="button" onClick={handleSignOut} className="btn-primary text-sm">
                {t('nav.signOut')}
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="btn-secondary text-sm">
                {t('nav.signIn')}
              </Link>
              <Link href="/sign-up" className="btn-primary text-sm">
                {t('nav.signUp')}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
