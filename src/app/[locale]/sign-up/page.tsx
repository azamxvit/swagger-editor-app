import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/server';
import { AuthForm } from '@/components/auth/AuthForm';

export default async function SignUpPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getUser();
  if (user) {
    redirect(`/${locale}`);
  }

  return <AuthForm mode="sign-up" />;
}
