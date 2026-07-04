import { setRequestLocale } from 'next-intl/server';
import { AuthForm } from '@/components/auth/AuthForm';

export default async function SignUpPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AuthForm mode="sign-up" />;
}
