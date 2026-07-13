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
import { PasswordField } from './PasswordField';

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
    <section className="mx-auto w-full max-w-md" aria-labelledby="auth-title">
      <h1 id="auth-title" className="mb-6 text-center text-2xl font-bold">
        {isSignUp ? t('signUpTitle') : t('signInTitle')}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <fieldset className="space-y-4 border-0 p-0">
          <legend className="sr-only">
            {isSignUp ? t('signUpTitle') : t('signInTitle')}
          </legend>

          <p className="m-0">
            <label htmlFor="email" className="label">
              {t('email')}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="input"
              placeholder={t('emailPlaceholder')}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              {...register('email')}
            />
            {errors.email && (
              <strong id="email-error" className="error-text font-normal">
                {errors.email.message}
              </strong>
            )}
          </p>

          <PasswordField
            id="password"
            label={t('password')}
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            placeholder={t('passwordPlaceholder')}
            error={errors.password?.message}
            hint={!isSignUp ? t('passwordHint') : undefined}
            describedBy={isSignUp ? 'password-requirements' : undefined}
            trailing={
              <output
                htmlFor="password"
                className="text-xs text-[var(--muted)]"
                aria-live="polite"
              >
                {t('charCount', { count: passwordValue.length })}
              </output>
            }
            {...register('password')}
          />
          {isSignUp && (
            <PasswordRequirements id="password-requirements" password={passwordValue} />
          )}

          {isSignUp && (
            <PasswordField
              id="confirmPassword"
              label={t('confirmPassword')}
              autoComplete="new-password"
              placeholder={t('confirmPasswordPlaceholder')}
              error={
                'confirmPassword' in errors ? errors.confirmPassword?.message : undefined
              }
              {...register('confirmPassword')}
            />
          )}
        </fieldset>

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
    </section>
  );
}
