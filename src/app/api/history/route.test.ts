import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  order: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  getUser: mocks.getUser,
  createClient: vi.fn().mockResolvedValue({
    from: () => ({
      select: () => ({ eq: () => ({ order: mocks.order }) }),
    }),
  }),
}));

describe('GET /api/history', () => {
  beforeEach(() => {
    mocks.getUser.mockReset();
    mocks.order.mockReset();
  });

  it('returns 401 for anonymous users', async () => {
    mocks.getUser.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('returns history entries for authenticated users', async () => {
    mocks.getUser.mockResolvedValue({ id: 'user-1' });
    mocks.order.mockResolvedValue({
      data: [{ id: '1', method: 'GET', url: 'https://api.example.com' }],
      error: null,
    });
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].method).toBe('GET');
  });

  it('returns 500 when the database query fails', async () => {
    mocks.getUser.mockResolvedValue({ id: 'user-1' });
    mocks.order.mockResolvedValue({ data: null, error: { message: 'db down' } });
    const res = await GET();
    expect(res.status).toBe(500);
  });
});
