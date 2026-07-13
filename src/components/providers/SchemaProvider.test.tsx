import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { SchemaProvider, useSchema } from '@/components/providers/SchemaProvider';

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  validate: vi.fn(),
}));

vi.mock('@/components/providers/AuthProvider', () => ({
  useAuth: () => mocks.useAuth(),
}));

vi.mock('@/lib/openapi/validator', () => ({
  validateOpenAPISpec: mocks.validate,
}));

function Consumer() {
  const { content, format, isValid, setContent, setFormat, saveSchema } = useSchema();
  return (
    <div>
      <span data-testid="format">{format}</span>
      <span data-testid="valid">{String(isValid)}</span>
      <span data-testid="content">{content.slice(0, 20)}</span>
      <button type="button" onClick={() => setContent('{"openapi":"3.0.0"}')}>
        set-json
      </button>
      <button type="button" onClick={() => setFormat('json')}>
        set-format
      </button>
      <button
        type="button"
        onClick={async () => {
          const ok = await saveSchema();
          document.title = `saved:${ok}`;
        }}
      >
        save
      </button>
    </div>
  );
}

function renderProvider() {
  return render(
    <SchemaProvider>
      <Consumer />
    </SchemaProvider>,
  );
}

describe('SchemaProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mocks.useAuth.mockReturnValue({ user: null });
    mocks.validate.mockResolvedValue({
      valid: true,
      errors: [],
      spec: { title: 'T', version: '1', endpoints: [], raw: {} },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('starts with the default yaml schema', () => {
    renderProvider();
    expect(screen.getByTestId('format').textContent).toBe('yaml');
  });

  it('auto-detects json format when content changes', async () => {
    renderProvider();
    fireEvent.click(screen.getByText('set-json'));
    expect(screen.getByTestId('format').textContent).toBe('json');
  });

  it('validates content after the debounce delay', async () => {
    renderProvider();
    await act(async () => {
      vi.advanceTimersByTime(600);
    });
    await waitFor(() => {
      expect(mocks.validate).toHaveBeenCalled();
      expect(screen.getByTestId('valid').textContent).toBe('true');
    });
  });

  it('does not save schema for anonymous users', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    renderProvider();
    fireEvent.click(screen.getByText('save'));
    await waitFor(() => {
      expect(document.title).toBe('saved:false');
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('saves schema through the API for authenticated users', async () => {
    mocks.useAuth.mockReturnValue({ user: { id: 'u1' } });
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => null });
    vi.stubGlobal('fetch', fetchMock);
    renderProvider();
    fireEvent.click(screen.getByText('save'));
    await waitFor(() => {
      expect(document.title).toBe('saved:true');
    });
    const putCall = fetchMock.mock.calls.find(([, opts]) => opts?.method === 'PUT');
    expect(putCall).toBeDefined();
  });
});
