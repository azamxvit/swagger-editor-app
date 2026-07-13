import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { AuthForm } from '@/components/auth/AuthForm';

const mocks = vi.hoisted(() => ({
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mocks.signInWithPassword,
      signUp: mocks.signUp,
    },
  }),
}));

vi.mock('@/i18n/routing', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  useRouter: () => ({ push: mocks.push }),
}));

vi.mock('@/components/providers/AuthProvider', () => ({
  useAuth: () => ({ refresh: mocks.refresh }),
}));

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

const messages = {
  auth: {
    signInTitle: 'Sign In',
    signUpTitle: 'Sign Up',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    signInButton: 'Sign In',
    signUpButton: 'Create Account',
    signInSuccess: 'Signed in successfully',
    signUpSuccess: 'Account created successfully',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
  },
  errors: { generic: 'Something went wrong. Please try again.' },
};

function renderForm(mode: 'sign-in' | 'sign-up') {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <AuthForm mode={mode} />
    </NextIntlClientProvider>,
  );
}

describe('AuthForm', () => {
  beforeEach(() => {
    mocks.signInWithPassword.mockReset();
    mocks.signUp.mockReset();
    mocks.push.mockReset();
    mocks.refresh.mockReset();
  });

  it('shows validation errors for invalid email', async () => {
    renderForm('sign-in');
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'not-an-email' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password1!' } });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(document.querySelector('.error-text')).toBeInTheDocument();
    });
    expect(mocks.signInWithPassword).not.toHaveBeenCalled();
  });

  it('shows validation error for a weak password on sign up', async () => {
    renderForm('sign-up');
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(document.querySelector('.error-text')).toBeInTheDocument();
    });
    expect(mocks.signUp).not.toHaveBeenCalled();
  });

  it('signs in and redirects to the main page', async () => {
    mocks.signInWithPassword.mockResolvedValue({ error: null });
    renderForm('sign-in');
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password1!' } });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mocks.signInWithPassword).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'Password1!',
      });
    });
    await waitFor(() => {
      expect(mocks.push).toHaveBeenCalledWith('/');
    });
    expect(mocks.refresh).toHaveBeenCalled();
  });
});
