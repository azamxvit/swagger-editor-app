'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/routing';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import {
  signInSchema,
  signUpSchema,
  type SignInFormData,
  type SignUpFormData,
} from '@/lib/auth/validation';
import { useAuth } from '@/components/providers/AuthProvider';

interface AuthFormProps {
  mode: 'sign-in' | 'sign-up';
}

export function AuthForm({ mode }: AuthFormProps) {
  const t = useTranslations('auth');
  const tErrors = useTranslations('errors');
  const router = useRouter();
  const { refresh } = useAuth();
  const supabase = createClient();
  const isSignUp = mode === 'sign-up';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData | SignUpFormData>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
  });

  const onSubmit = async (data: SignInFormData | SignUpFormData) => {
    try {
      if (isSignUp) {
        const signUpData = data as SignUpFormData;
        const { error } = await supabase.auth.signUp({
          email: signUpData.email,
          password: signUpData.password,
        });
        if (error) throw error;
        toast.success(t('signUpSuccess'));
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (error) throw error;
        toast.success(t('signInSuccess'));
      }
      await refresh();
      router.push('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : tErrors('generic');
      toast.error(message);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="mb-6 text-2xl font-bold text-center">
        {isSignUp ? t('signUpTitle') : t('signInTitle')}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="label">
            {t('email')}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="input"
            {...register('email')}
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="label">
            {t('password')}
          </label>
          <input
            id="password"
            type="password"
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            className="input"
            {...register('password')}
          />
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>

        {isSignUp && (
          <div>
            <label htmlFor="confirmPassword" className="label">
              {t('confirmPassword')}
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="input"
              {...register('confirmPassword')}
            />
            {'confirmPassword' in errors && errors.confirmPassword && (
              <p className="error-text">{errors.confirmPassword.message}</p>
            )}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting
            ? '...'
            : isSignUp
              ? t('signUpButton')
              : t('signInButton')}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-[var(--muted)]">
        {isSignUp ? t('hasAccount') : t('noAccount')}{' '}
        <Link
          href={isSignUp ? '/sign-in' : '/sign-up'}
          className="text-[var(--primary)] hover:underline"
        >
          {isSignUp ? t('signInButton') : t('signUpButton')}
        </Link>
      </p>
    </div>
  );
}
