import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, DELETE } from './route';

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  order: vi.fn(),
  eq: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  getUser: mocks.getUser,
  createClient: vi.fn().mockResolvedValue({
    from: () => ({
      select: () => ({ eq: () => ({ order: mocks.order }) }),
      delete: () => ({ eq: mocks.eq }),
    }),
  }),
}));

describe('GET /api/history', () => {
  beforeEach(() => {
    mocks.getUser.mockReset();
    mocks.order.mockReset();
    mocks.eq.mockReset();
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

describe('DELETE /api/history', () => {
  beforeEach(() => {
    mocks.getUser.mockReset();
    mocks.eq.mockReset();
  });

  it('returns 401 for anonymous users', async () => {
    mocks.getUser.mockResolvedValue(null);
    const res = await DELETE();
    expect(res.status).toBe(401);
  });

  it('clears history for authenticated users', async () => {
    mocks.getUser.mockResolvedValue({ id: 'user-1' });
    mocks.eq.mockResolvedValue({ error: null });
    const res = await DELETE();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mocks.eq).toHaveBeenCalledWith('user_id', 'user-1');
  });

  it('returns 500 when the delete fails', async () => {
    mocks.getUser.mockResolvedValue({ id: 'user-1' });
    mocks.eq.mockResolvedValue({ error: { message: 'db down' } });
    const res = await DELETE();
    expect(res.status).toBe(500);
  });
});
