import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { User } from '@supabase/supabase-js';
import { AuthProvider, useAuth } from '@/components/providers/AuthProvider';

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChange: vi.fn(),
}));

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: mocks.getUser,
      signOut: mocks.signOut,
      onAuthStateChange: mocks.onAuthStateChange,
    },
  }),
}));

function Consumer() {
  const { user, signOut, refresh } = useAuth();
  return (
    <div>
      <span data-testid="user">{user?.email ?? 'anonymous'}</span>
      <button type="button" onClick={signOut}>
        sign-out
      </button>
      <button type="button" onClick={refresh}>
        refresh
      </button>
    </div>
  );
}

const testUser = { id: 'u1', email: 'user@example.com' } as User;

describe('AuthProvider', () => {
  beforeEach(() => {
    mocks.getUser.mockReset().mockResolvedValue({ data: { user: null } });
    mocks.signOut.mockReset().mockResolvedValue({ error: null });
    mocks.onAuthStateChange
      .mockReset()
      .mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
  });

  it('exposes the initial user', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: testUser } });
    render(
      <AuthProvider initialUser={testUser}>
        <Consumer />
      </AuthProvider>,
    );
    expect(screen.getByTestId('user').textContent).toBe('user@example.com');
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('user@example.com');
    });
  });

  it('clears the user on sign out', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: testUser } });
    render(
      <AuthProvider initialUser={testUser}>
        <Consumer />
      </AuthProvider>,
    );
    fireEvent.click(screen.getByText('sign-out'));
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('anonymous');
    });
    expect(mocks.signOut).toHaveBeenCalled();
  });

  it('refreshes the user from supabase', async () => {
    mocks.getUser
      .mockResolvedValueOnce({ data: { user: null } })
      .mockResolvedValueOnce({ data: { user: testUser } });
    render(
      <AuthProvider initialUser={null}>
        <Consumer />
      </AuthProvider>,
    );
    expect(screen.getByTestId('user').textContent).toBe('anonymous');
    fireEvent.click(screen.getByText('refresh'));
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('user@example.com');
    });
  });
});
