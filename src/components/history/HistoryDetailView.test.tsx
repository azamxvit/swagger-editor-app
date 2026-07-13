import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { HistoryDetailView } from '@/components/history/HistoryDetailView';
import type { RequestHistoryDetail } from '@/lib/openapi/types';

vi.mock('@/i18n/routing', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const messages = {
  history: {
    back: 'Back to History',
    details: 'Details',
    method: 'Method',
    status: 'Status',
    duration: 'Duration',
    timestamp: 'Timestamp',
    requestSize: 'Request Size',
    responseSize: 'Response Size',
    endpoint: 'Endpoint',
    url: 'URL',
    error: 'Error',
  },
};

const entry: RequestHistoryDetail = {
  id: '1',
  method: 'POST',
  url: 'https://api.example.com/pets',
  endpoint: 'POST /pets',
  request_size: 120,
  response_size: 340,
  status_code: 201,
  duration_ms: 87,
  error_details: null,
  created_at: '2026-02-01T10:00:00Z',
  request_headers: { 'Content-Type': 'application/json' },
  request_body: '{"name":"Rex"}',
  response_headers: { 'content-type': 'application/json' },
  response_body: '{"id":1}',
};

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe('HistoryDetailView', () => {
  it('renders analytics stats for the request', () => {
    renderWithIntl(<HistoryDetailView entry={entry} />);
    expect(screen.getByText('POST')).toBeInTheDocument();
    expect(screen.getByText('201')).toBeInTheDocument();
    expect(screen.getByText('87ms')).toBeInTheDocument();
    expect(screen.getByText('120 B')).toBeInTheDocument();
    expect(screen.getByText('340 B')).toBeInTheDocument();
  });

  it('renders endpoint and full url', () => {
    renderWithIntl(<HistoryDetailView entry={entry} />);
    expect(screen.getByText('POST /pets')).toBeInTheDocument();
    expect(screen.getByText('https://api.example.com/pets')).toBeInTheDocument();
  });

  it('renders request and response bodies', () => {
    renderWithIntl(<HistoryDetailView entry={entry} />);
    expect(screen.getByText('{"name":"Rex"}')).toBeInTheDocument();
    expect(screen.getByText('{"id":1}')).toBeInTheDocument();
  });

  it('shows error details when present', () => {
    renderWithIntl(<HistoryDetailView entry={{ ...entry, error_details: 'Timeout' }} />);
    expect(screen.getByText('Timeout')).toBeInTheDocument();
  });
});
