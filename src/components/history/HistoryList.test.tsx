import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { HistoryList } from '@/components/history/HistoryList';
import type { RequestHistoryEntry } from '@/lib/openapi/types';

vi.mock('@/i18n/routing', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const messages = {
  history: {
    title: 'History & Analytics',
    empty: "You haven't executed any requests yet",
    emptyHint: 'Use the Editor and Viewer',
    goToEditor: 'Go to Editor',
    timestamp: 'Timestamp',
    method: 'Method',
    endpoint: 'Endpoint',
    status: 'Status',
    duration: 'Duration',
    requestSize: 'Request Size',
    responseSize: 'Response Size',
    details: 'Details',
  },
};

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

const sampleEntry: RequestHistoryEntry = {
  id: '1',
  method: 'GET',
  url: 'https://api.example.com/users',
  endpoint: 'GET /users',
  request_size: 100,
  response_size: 500,
  status_code: 200,
  duration_ms: 150,
  error_details: null,
  created_at: '2026-01-01T12:00:00Z',
};

describe('HistoryList', () => {
  it('shows empty state with link to editor', () => {
    renderWithIntl(<HistoryList entries={[]} />);
    expect(screen.getByText("You haven't executed any requests yet")).toBeInTheDocument();
    expect(screen.getByText('Go to Editor')).toBeInTheDocument();
  });

  it('renders history entries', () => {
    renderWithIntl(<HistoryList entries={[sampleEntry]} />);
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('GET /users')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('150ms')).toBeInTheDocument();
  });

  it('shows error status in red styling class', () => {
    const errorEntry = { ...sampleEntry, status_code: 500 };
    renderWithIntl(<HistoryList entries={[errorEntry]} />);
    expect(screen.getByText('500')).toHaveClass('text-red-400');
  });
});
