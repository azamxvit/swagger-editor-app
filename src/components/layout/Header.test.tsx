import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { User } from '@supabase/supabase-js';
import { Header } from '@/components/layout/Header';

const mockUseAuth = vi.fn();

vi.mock('@/components/providers/AuthProvider', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('@/i18n/routing', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/',
}));

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

const messages = {
  app: { title: 'Swagger Editor' },
  nav: {
    about: 'About',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    history: 'History',
  },
  auth: { signOutSuccess: 'Signed out successfully' },
};

function renderHeader() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <Header />
    </NextIntlClientProvider>,
  );
}

describe('Header', () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  it('shows Sign In and Sign Up for guests', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false, signOut: vi.fn() });
    renderHeader();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.queryByText('History')).not.toBeInTheDocument();
  });

  it('shows History and Sign Out for authenticated users', () => {
    mockUseAuth.mockReturnValue({ user: { id: 'u1' } as User, loading: false, signOut: vi.fn() });
    renderHeader();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
  });

  it('always shows the About link', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false, signOut: vi.fn() });
    renderHeader();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('uses the app logo icon instead of a lightning emoji', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false, signOut: vi.fn() });
    const { container } = renderHeader();
    expect(container.textContent).not.toContain('⚡');
    expect(screen.getByText('Swagger Editor').closest('a')?.querySelector('svg')).toBeTruthy();
  });

  it('shows auth skeleton while loading', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true, signOut: vi.fn() });
    const { container } = renderHeader();
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    expect(container.querySelector('.animate-pulse')).toBeTruthy();
  });
});
