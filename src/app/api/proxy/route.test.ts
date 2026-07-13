import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from './route';

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  insert: vi.fn().mockResolvedValue({ error: null }),
}));

vi.mock('@/lib/supabase/server', () => ({
  getUser: mocks.getUser,
  createClient: vi.fn().mockResolvedValue({
    from: () => ({ insert: mocks.insert }),
  }),
}));

function makeRequest(payload: unknown) {
  return new Request('http://localhost/api/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

describe('POST /api/proxy', () => {
  beforeEach(() => {
    mocks.getUser.mockResolvedValue(null);
    mocks.insert.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns 400 when url or method is missing', async () => {
    const res = await POST(makeRequest({ method: 'GET' }));
    expect(res.status).toBe(400);
  });

  it('proxies the request and returns the upstream response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('{"ok":true}', {
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
        }),
      ),
    );

    const res = await POST(
      makeRequest({ url: 'https://api.example.com/pets', method: 'GET' }),
    );
    const data = await res.json();

    expect(data.status).toBe(200);
    expect(data.body).toBe('{"ok":true}');
    expect(typeof data.durationMs).toBe('number');
  });

  it('captures network errors instead of throwing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('DNS failure')));

    const res = await POST(
      makeRequest({ url: 'https://broken.example.com', method: 'GET' }),
    );
    const data = await res.json();

    expect(data.status).toBe(0);
    expect(data.error).toBe('DNS failure');
  });

  it('logs the request to history for authenticated users', async () => {
    mocks.getUser.mockResolvedValue({ id: 'user-1' });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('ok', { status: 200 })),
    );

    await POST(makeRequest({ url: 'https://api.example.com', method: 'POST', body: '{}' }));

    expect(mocks.insert).toHaveBeenCalledTimes(1);
    expect(mocks.insert.mock.calls[0][0]).toMatchObject({
      user_id: 'user-1',
      method: 'POST',
      url: 'https://api.example.com',
    });
  });
});
