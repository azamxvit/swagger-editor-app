import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { EndpointDetail } from '@/components/viewer/EndpointDetail';
import type { OpenAPIEndpoint } from '@/lib/openapi/types';

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

const messages = {
  viewer: {
    parameters: 'Parameters',
    requestBody: 'Request Body',
    responses: 'Responses',
    execute: 'Execute',
    executing: 'Executing...',
    generateCurl: 'Generate cURL',
    copyCurl: 'Copy to Clipboard',
    curlCopied: 'cURL command copied',
    response: 'Response',
    status: 'Status',
    headers: 'Headers',
    body: 'Body',
    duration: 'Duration',
    path: 'Path',
    query: 'Query',
    header: 'Header',
    cookie: 'Cookie',
    required: 'required',
    schema: 'Schema',
    noParameters: 'No parameters',
  },
};

const endpoint: OpenAPIEndpoint = {
  id: 'get-/pets/{petId}',
  method: 'GET',
  path: '/pets/{petId}',
  summary: 'Get a pet',
  parameters: [
    { name: 'petId', in: 'path', required: true },
    { name: 'verbose', in: 'query' },
    { name: 'X-Api-Key', in: 'header' },
    { name: 'session', in: 'cookie' },
  ],
  responses: [{ statusCode: '200', description: 'OK' }],
  servers: ['https://api.example.com'],
};

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

function fillParam(name: string, value: string) {
  const label = screen.getByText(name).closest('label')!;
  const input = label.parentElement!.querySelector('input')!;
  fireEvent.change(input, { target: { value } });
}

describe('EndpointDetail', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders all parameter types', () => {
    renderWithIntl(<EndpointDetail endpoint={endpoint} />);
    expect(screen.getByText('petId')).toBeInTheDocument();
    expect(screen.getByText('verbose')).toBeInTheDocument();
    expect(screen.getByText('X-Api-Key')).toBeInTheDocument();
    expect(screen.getByText('session')).toBeInTheDocument();
    expect(screen.getByText(/Cookie/)).toBeInTheDocument();
  });

  it('generates a cURL command with path, query, header and cookie values', () => {
    renderWithIntl(<EndpointDetail endpoint={endpoint} />);
    fillParam('petId', '42');
    fillParam('verbose', 'true');
    fillParam('X-Api-Key', 'secret');
    fillParam('session', 'abc123');

    fireEvent.click(screen.getByText('Generate cURL'));

    const curl = document.querySelector('pre')!.textContent!;
    expect(curl).toContain("'https://api.example.com/pets/42?verbose=true'");
    expect(curl).toContain("X-Api-Key: secret");
    expect(curl).toContain('Cookie: session=abc123');
  });

  it('executes a request through the proxy and shows the response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        body: '{"id":42}',
        durationMs: 55,
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    renderWithIntl(<EndpointDetail endpoint={endpoint} />);
    fillParam('petId', '42');
    fillParam('session', 'abc123');
    fireEvent.click(screen.getByText('Execute'));

    await waitFor(() => {
      expect(screen.getByText('{"id":42}')).toBeInTheDocument();
    });

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/proxy');
    const payload = JSON.parse(options.body);
    expect(payload.url).toBe('https://api.example.com/pets/42');
    expect(payload.headers.Cookie).toBe('session=abc123');

    vi.unstubAllGlobals();
  });
});
