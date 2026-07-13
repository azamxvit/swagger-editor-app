import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { SwaggerViewerPanel } from '@/components/viewer/SwaggerViewerPanel';
import type { ParsedOpenAPISpec } from '@/lib/openapi/types';

const mockUseSchema = vi.fn();

vi.mock('@/components/providers/SchemaProvider', () => ({
  useSchema: () => mockUseSchema(),
}));

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

const messages = {
  viewer: {
    noSpec: 'Load a valid OpenAPI schema to see endpoints',
    selectEndpoint: 'Select an endpoint to view details',
    parameters: 'Parameters',
    noParameters: 'No parameters',
    requestBody: 'Request Body',
    responses: 'Responses',
    execute: 'Execute',
    generateCurl: 'Generate cURL',
    hideCurl: 'Hide cURL',
    copyCurl: 'Copy to Clipboard',
    path: 'Path',
    query: 'Query',
    header: 'Header',
    cookie: 'Cookie',
    required: 'required',
    optional: 'optional',
    schema: 'Schema',
    name: 'Name',
    in: 'In',
    example: 'Example',
    tryItOut: 'Try it out',
    requestUrl: 'Request URL',
  },
};

const spec: ParsedOpenAPISpec = {
  title: 'Pet Store',
  version: '1.0.0',
  baseUrl: 'https://api.example.com',
  endpoints: [
    {
      id: 'get-/pets',
      method: 'GET',
      path: '/pets',
      parameters: [],
      responses: [{ statusCode: '200', description: 'OK' }],
    },
  ],
  raw: {},
};

function renderPanel() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <SwaggerViewerPanel />
    </NextIntlClientProvider>,
  );
}

describe('SwaggerViewerPanel', () => {
  it('shows a hint when no spec is loaded', () => {
    mockUseSchema.mockReturnValue({ spec: null, isLoading: false, isValidating: false });
    renderPanel();
    expect(screen.getByText('Load a valid OpenAPI schema to see endpoints')).toBeInTheDocument();
  });

  it('lists endpoints from the spec', () => {
    mockUseSchema.mockReturnValue({ spec, isLoading: false, isValidating: false });
    renderPanel();
    expect(screen.getByText('Pet Store')).toBeInTheDocument();
    expect(screen.getByText('/pets')).toBeInTheDocument();
    expect(screen.getByText('Select an endpoint to view details')).toBeInTheDocument();
  });

  it('opens endpoint details on click', () => {
    mockUseSchema.mockReturnValue({ spec, isLoading: false, isValidating: false });
    renderPanel();
    fireEvent.click(screen.getByText('/pets'));
    expect(screen.getByText('Responses')).toBeInTheDocument();
    expect(screen.getByText('Execute')).toBeInTheDocument();
  });
});
