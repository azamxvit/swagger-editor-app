import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, PUT } from './route';

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  single: vi.fn(),
  upsert: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  getUser: mocks.getUser,
  createClient: vi.fn().mockResolvedValue({
    from: () => ({
      select: () => ({ eq: () => ({ single: mocks.single }) }),
      upsert: mocks.upsert,
    }),
  }),
}));

describe('/api/schema', () => {
  beforeEach(() => {
    mocks.getUser.mockReset();
    mocks.single.mockReset();
    mocks.upsert.mockReset();
  });

  it('GET returns 401 for anonymous users', async () => {
    mocks.getUser.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('GET returns the saved schema for authenticated users', async () => {
    mocks.getUser.mockResolvedValue({ id: 'user-1' });
    mocks.single.mockResolvedValue({
      data: { content: 'openapi: 3.0.0', format: 'yaml' },
      error: null,
    });
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.format).toBe('yaml');
  });

  it('PUT returns 401 for anonymous users', async () => {
    mocks.getUser.mockResolvedValue(null);
    const res = await PUT(
      new Request('http://localhost/api/schema', {
        method: 'PUT',
        body: JSON.stringify({ content: 'x', format: 'json' }),
      }),
    );
    expect(res.status).toBe(401);
  });

  it('PUT returns 400 when content is missing', async () => {
    mocks.getUser.mockResolvedValue({ id: 'user-1' });
    const res = await PUT(
      new Request('http://localhost/api/schema', {
        method: 'PUT',
        body: JSON.stringify({ format: 'json' }),
      }),
    );
    expect(res.status).toBe(400);
  });

  it('PUT saves the schema for authenticated users', async () => {
    mocks.getUser.mockResolvedValue({ id: 'user-1' });
    mocks.upsert.mockResolvedValue({ error: null });
    const res = await PUT(
      new Request('http://localhost/api/schema', {
        method: 'PUT',
        body: JSON.stringify({ content: 'openapi: 3.0.0', format: 'yaml' }),
      }),
    );
    expect(res.status).toBe(200);
    expect(mocks.upsert).toHaveBeenCalledTimes(1);
    expect(mocks.upsert.mock.calls[0][0]).toMatchObject({
      user_id: 'user-1',
      content: 'openapi: 3.0.0',
      format: 'yaml',
    });
  });
});
