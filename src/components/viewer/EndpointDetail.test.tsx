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
    hideCurl: 'Hide cURL',
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
    optional: 'optional',
    schema: 'Schema',
    noParameters: 'No parameters',
    name: 'Name',
    in: 'In',
    example: 'Example',
    tryItOut: 'Try it out',
    requestUrl: 'Request URL',
    fillRequired: 'Fill required fields',
    invalidJson: 'Invalid JSON format',
    requestFailed: 'Failed to execute request',
    enterJsonBody: 'Enter JSON body',
    exampleFromSpec: 'Example from spec',
    hideExample: 'Hide example',
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

function fillTryItParam(name: string, value: string) {
  const labels = screen.getAllByText(name);
  const tryItLabel = labels[labels.length - 1].closest('label')!;
  const input = tryItLabel.parentElement!.querySelector('input')!;
  fireEvent.change(input, { target: { value } });
}

describe('EndpointDetail', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders parameter docs table with all parameter types', () => {
    renderWithIntl(<EndpointDetail endpoint={endpoint} />);
    expect(screen.getByText('Try it out')).toBeInTheDocument();
    expect(screen.getAllByText('petId').length).toBeGreaterThan(0);
    expect(screen.getAllByText('cookie').length).toBeGreaterThan(0);
  });

  it('generates a cURL command with path, query, header and cookie values', () => {
    renderWithIntl(<EndpointDetail endpoint={endpoint} />);
    fillTryItParam('petId', '42');
    fillTryItParam('verbose', 'true');
    fillTryItParam('X-Api-Key', 'secret');
    fillTryItParam('session', 'abc123');

    fireEvent.click(screen.getByText('Generate cURL'));

    const curl = document.querySelector('pre')!.textContent!;
    expect(curl).toContain("'https://api.example.com/pets/42?verbose=true'");
    expect(curl).toContain('X-Api-Key: secret');
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
    fillTryItParam('petId', '42');
    fillTryItParam('session', 'abc123');
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
