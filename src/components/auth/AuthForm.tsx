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
import { PasswordRequirements } from './PasswordRequirements';

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
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData | SignUpFormData>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
    mode: 'onChange',
  });

  const passwordValue = watch('password') ?? '';

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
      <h1 className="mb-6 text-center text-2xl font-bold">
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
            placeholder={t('emailPlaceholder')}
            {...register('email')}
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between gap-2">
            <label htmlFor="password" className="label mb-0">
              {t('password')}
            </label>
            <span className="text-xs text-[var(--muted)]">
              {t('charCount', { count: passwordValue.length })}
            </span>
          </div>
          <input
            id="password"
            type="password"
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            className="input"
            placeholder={t('passwordPlaceholder')}
            {...register('password')}
          />
          {errors.password && <p className="error-text">{errors.password.message}</p>}
          {isSignUp && <PasswordRequirements password={passwordValue} />}
          {!isSignUp && (
            <p className="mt-1 text-xs text-[var(--muted)]">{t('passwordHint')}</p>
          )}
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
              placeholder={t('confirmPasswordPlaceholder')}
              {...register('confirmPassword')}
            />
            {'confirmPassword' in errors && errors.confirmPassword && (
              <p className="error-text">{errors.confirmPassword.message}</p>
            )}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting
            ? t('submitting')
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
