import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getUser } from '@/lib/supabase/server';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'en' | 'ru')) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const user = await getUser();

  return (
    <NextIntlClientProvider messages={messages}>
      <AuthProvider initialUser={user}>
        <ToastProvider />
        <Header />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">{children}</main>
        <Footer />
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
